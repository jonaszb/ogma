<template>
    <div class="repo-form">
        <h1>AI-powered readme generator for GitHub repositories</h1>
        <form @submit.prevent="handleSubmit">
            <Transition mode="out-in" appear>
                <UrlFormStep v-if="!repoFormStore.repositoryIsValid" />
                <InfoFormStep v-else />
            </Transition>
        </form>
    </div>
</template>

<script setup lang="ts">
import { repoFormStore } from '../../store/repoFormStore';
import { toastStore } from '../../store/toastStore';
import { taskStore } from '../../store/taskStore';
import { Transition, ref, watch } from 'vue';
import UrlFormStep from './UrlFormStep.vue';
import InfoFormStep from './InfoFormStep.vue';

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

watch(
    () => repoFormStore.additionalInfo,
    () => {
        repoFormStore.validateAdditionalInfo();
    }
);
</script>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: end;
    width: 100%;
    gap: 1.5rem;
}
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
        margin-top: 3rem;
        width: 50rem;
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
        }
    }
}
</style>
