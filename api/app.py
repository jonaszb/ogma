from fastapi import FastAPI, BackgroundTasks, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import time
import uuid
import os
import openai
from modules.repo import GithubRepository

app = FastAPI()

status_db = {}  # In-memory storage for the status and result.

gh_token = os.getenv("GITHUB_TOKEN")
openai.api_key = os.getenv("OPENAI_API_KEY")

if gh_token is None:
    raise Exception("GITHUB_TOKEN not set")

# Pydantic model for the input data.


class RepoData(BaseModel):
    url: str
    info: str


def set_error_status(task_id: str, error: str):
    status_db[task_id]['status'] = "error"
    status_db[task_id]['result'] = error


def validate(repository: GithubRepository, task_id: str):
    try:
        repository.validate_repository()
    except ValueError:
        set_error_status(task_id, "Invalid repository")
        return False
    except Exception as e:
        set_error_status(task_id, str(e))
        return False
    return True


def process_data(task_id: str, repository: GithubRepository, info: str):
    # Step 1: Scan the repository
    try:
        repository.scan()
    except Exception as e:
        set_error_status(task_id, str(e))
        return
    status_db[task_id]['status'] = "Analyzed"

    # Step 2: Generate the markdown
    try:
        markdown = repository.generate_readme(info)
    except Exception as e:
        set_error_status(task_id, str(e))
        return
    status_db[task_id]['result'] = markdown
    status_db[task_id]['status'] = "done"


@app.post("/generate/")
async def generate(data: RepoData, background_tasks: BackgroundTasks, response: Response):
    if data.info:
        try:
            res = openai.Moderation.create(input=data.info)
            if (res['results']['flagged']):
                response.status_code = 400
                return {"error": "Input violates content policy"}
        except:
            response.status_code = 400
            return {"error": "Policy check failed"}
    try:
        repo = GithubRepository(data.url)
        repo.set_token(gh_token)
    except Exception:
        response.status_code = 400
        return {"error": "Failed to identify repository"}
    try:
        repo.validate_repository()
    except:
        response.status_code = 400
        return {"error": "Failed to validate repository"}
    task_id = str(uuid.uuid4())
    status_db[task_id] = {'status': 'started'}
    background_tasks.add_task(process_data, task_id, repo, data.info)
    return {"task_id": task_id}


@app.get("/events/{task_id}/")
async def events(task_id: str):
    def event_stream():
        current_status = status_db[task_id]['status']
        while current_status not in ['done', 'error']:
            yield f"data: {current_status  + (' ' * 2048)}\n\n"
            time.sleep(.5)
            current_status = status_db[task_id]['status']
        if current_status == 'error':
            yield f"data: {status_db[task_id]['status'] + ': ' + status_db[task_id]['result']}\n\n"
        else:
            next_value = next(status_db[task_id]['result'])
            choice = next_value['choices'][0]
            while not choice['finish_reason']:
                lines = choice['delta']['content'].split('\n')
                for i, line in enumerate(lines):
                    if i > 0:
                        line = "<br>" + line
                    yield f"data: {'md:' + (' ' * 1024) + line}\n\n"
                next_value = next(status_db[task_id]['result'])
                choice = next_value['choices'][0]
            yield f"data: {status_db[task_id]['status']}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/generate/{task_id}/")
async def get_result(task_id: str):
    return {"markdown": status_db[task_id]['result']}
