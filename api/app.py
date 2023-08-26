from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import time
import uuid

app = FastAPI()

status_db = {}  # In-memory storage for the status and result.

# Pydantic model for the input data.
class RepoData(BaseModel):
    url: str
    info: str

def process_data(task_id: str, url: str, info: str):
    # Simulate processing based on the provided URL and info.
    time.sleep(2)
    status_db[task_id]['status'] = "Validated repository: " + url

    time.sleep(2)
    status_db[task_id]['status'] = "Analyzed repository info: " + info

    time.sleep(2)
    markdown_content = f"## Sample Markdown Content from {url} with info {info}"
    status_db[task_id]['status'] = "done"
    status_db[task_id]['result'] = markdown_content

@app.post("/generate/")
async def generate(data: RepoData, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    status_db[task_id] = {'status': 'started'}
    background_tasks.add_task(process_data, task_id, data.url, data.info)
    return {"task_id": task_id}

@app.get("/events/{task_id}/")
async def events(task_id: str):
    def event_stream():
        while status_db[task_id]['status'] != 'done':
            yield f"data: {status_db[task_id]['status']  + (' ' * 2048)}\n\n"
            time.sleep(1)
        yield f"data: done\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/generate/{task_id}/")
async def get_result(task_id: str):
    return {"markdown": status_db[task_id]['result']}
