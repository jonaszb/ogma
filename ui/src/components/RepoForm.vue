<template>
    <div class="repo-form">
        <h1>AI-powered readme generator for GitHub repositories</h1>
        <form @submit.prevent="handleSubmit">
            <label hidden for="repository-url">GitHub repository URL</label>
            <input
                v-model="repositoryUrl"
                class="input-primary"
                :class="{ 'input-error': !repositoryUrlIsValid }"
                id="repository-url"
                type="text"
                placeholder="Repository URL..."
                @blur="validateRepositoryUrl"
            />
            <div>
                <label for="additional-info">Additional information</label>
                <textarea
                    v-model="additionalInfo"
                    class="input-primary"
                    :class="{ 'input-error': !additionalInfoIsValid }"
                    id="additional-info"
                    placeholder="e.g. required environment variables, how to run the project, etc."
                ></textarea>
                <p v-if="!additionalInfoIsValid" class="error-message">
                    Character limit exceeded ({{ additionalInfo.length }} / 2000)
                </p>
            </div>
            <button class="btn-primary" :disabled="validating" :class="validating && 'pulse'">Generate readme</button>
        </form>
    </div>
</template>

<script lang="ts">
import { repoFormStore } from '../store/repoFormStore';
import { toastStore } from '../store/toastStore';
import Spinner from './spinner/Spinner.vue';

export default {
    components: {
        Spinner,
    },
    props: {
        repoUrl: {
            type: String,
            default: '',
        },

        info: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            repositoryUrl: this.repoUrl,
            repositoryUrlIsValid: true,
            additionalInfo: this.info,
            additionalInfoIsValid: true,
            validating: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.validateRepositoryUrl();
            this.validateAdditionalInfo();
            if (this.repositoryUrlIsValid && this.additionalInfoIsValid) {
                this.validating = true;
                repoFormStore.setRepoUrl(this.repositoryUrl);
                repoFormStore.setAdditionalInfo(this.additionalInfo);
                try {
                    const response = await fetch('/api/generate/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url: this.repositoryUrl,
                            info: this.additionalInfo,
                        }),
                    });
                    if (!response.ok) {
                        const data = await response.json();
                        toastStore.addToast(data.error ?? 'Something went wrong', 'danger');
                        return;
                    }
                    repoFormStore.isProcessing = true;
                    const data = await response.json();
                    this.listenForUpdates(data.task_id);
                } catch (error) {
                    toastStore.addToast('Something went wrong', 'danger');
                    repoFormStore.isProcessing = false;
                } finally {
                    this.validating = false;
                }
            }
        },
        listenForUpdates(task_id: string) {
            const eventSource = new EventSource(`/api/events/${task_id}/`);
            eventSource.onmessage = (event) => {
                if (typeof event.data !== 'string') return;
                repoFormStore.setStatus(event.data);
                if (event.data.startsWith('md:')) {
                    let message = event.data.slice(1027); // include padding of 1024 spaces
                    if (message.startsWith('<br>')) {
                        message = message.slice(4);
                        repoFormStore.appendMarkdown('\n');
                    }
                    repoFormStore.appendMarkdown(message);
                } else if (event.data.toLocaleLowerCase().startsWith('validated')) repoFormStore.validatedRepo = true;
                else if (event.data.toLocaleLowerCase().startsWith('analyzed')) repoFormStore.fetchedRepo = true;
                else if (event.data.startsWith('done')) {
                    eventSource.close();
                } else if (event.data.startsWith('error')) {
                    eventSource.close();
                    repoFormStore.resetProgress();
                    // TODO: Display error message
                }
            };
        },
        validateRepositoryUrl() {
            const githubRepoRegex = /^(?:https?:\/\/)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/)?/;
            this.repositoryUrlIsValid = githubRepoRegex.test(this.repositoryUrl);
        },
        validateAdditionalInfo() {
            if (this.additionalInfo.length > 2000) {
                this.additionalInfoIsValid = false;
            } else {
                this.additionalInfoIsValid = true;
            }
        },
    },
    watch: {
        additionalInfo() {
            this.validateAdditionalInfo();
        },
        repositoryUrl() {
            if (!this.repositoryUrlIsValid) {
                this.validateRepositoryUrl();
            }
        },
    },
};
</script>

<style scoped>
.repo-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--sky-900);

    & h1 {
        text-wrap: balance;
        padding: 0 1.5rem;
        text-align: center;
        margin: 0;
        font-size: 2.25rem;
        font-weight: 500;
    }

    & form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 3rem;
        gap: 1.5rem;
        width: 50rem;

        & button {
            align-self: end;
        }

        > div {
            width: 100%;
        }

        & label:not([hidden]) {
            display: inline-block;
            font-size: 1.5rem;
            font-weight: 400;
            margin-bottom: 0.5rem;
        }

        & textarea {
            height: 12rem;
            resize: none;
            font-size: 1.5rem;
        }
    }
}

*[data-theme='dark'] .repo-form {
    color: var(--sky-100);
}

@media only screen and (max-width: 1024px) {
    .repo-form {
        & h1 {
            font-size: 2rem;
        }

        & form {
            width: min(calc(100% - 4rem), 40rem);
        }
    }
}

@media only screen and (max-width: 640px) {
    .repo-form {
        & h1 {
            font-size: 1.5rem;
        }

        & form {
            margin-top: 2rem;

            & textarea {
                height: 6rem;
                padding: 1rem;
                font-size: 1.25rem;
            }
        }
    }
}
</style>
