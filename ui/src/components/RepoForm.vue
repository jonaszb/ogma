<template>
    <div class="repo-form">
        <h1>AI-powered readme generator for GitHub repositories</h1>
        <form @submit.prevent="handleSubmit">
            <label hidden for="repository-url">GitHub repository URL</label>
            <input
                v-model="repoFormStore.repoUrl"
                class="input-primary"
                :class="{ 'input-error': !repoFormStore.repositoryUrlIsValid }"
                id="repository-url"
                type="text"
                placeholder="Repository URL..."
                @change="revalidateUrl"
                @blur="repoFormStore.validateRepositoryUrl"
            />
            <div>
                <label for="additional-info">Additional information</label>
                <textarea
                    v-model="repoFormStore.additionalInfo"
                    class="input-primary"
                    :class="{ 'input-error': !repoFormStore.additionalInfoIsValid }"
                    id="additional-info"
                    placeholder="e.g. required environment variables, how to run the project, etc."
                    @change="repoFormStore.validateAdditionalInfo"
                ></textarea>
                <p v-if="!repoFormStore.additionalInfoIsValid" class="error-message">
                    Character limit exceeded ({{ repoFormStore.additionalInfo.length }} / 2000)
                </p>
            </div>
            <button class="btn-primary" :disabled="validating" :class="validating && 'pulse'">Generate readme</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { repoFormStore } from '../store/repoFormStore';
import { toastStore } from '../store/toastStore';
import { taskStore } from '../store/taskStore';
import { ref, watch } from 'vue';

defineProps<{
    repoUrl: string;
    info: string;
}>();

const validating = ref(false);

const handleSubmit = async () => {
    repoFormStore.validateRepositoryUrl();
    repoFormStore.validateAdditionalInfo();
    if (repoFormStore.formIsValid()) {
        validating.value = true;
        try {
            const response = await fetch('/api/generate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: repoFormStore.repoUrl.toLowerCase(),
                    info: repoFormStore.additionalInfo,
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                toastStore.addToast(data.error ?? 'Something went wrong', 'danger');
                return;
            }
            repoFormStore.isProcessing = true;
            const data = await response.json();
            taskStore.listenForUpdates(data.task_id);
        } catch (error) {
            toastStore.addToast('Something went wrong', 'danger');
            repoFormStore.isProcessing = false;
        } finally {
            validating.value = false;
        }
    }
};
const revalidateUrl = () => {
    if (!repoFormStore.repositoryUrlIsValid) {
        repoFormStore.validateRepositoryUrl();
    }
};

watch(
    () => repoFormStore.additionalInfo,
    () => {
        repoFormStore.validateAdditionalInfo();
    }
);
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
