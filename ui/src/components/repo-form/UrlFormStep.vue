<template>
    <section>
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
        <button
            @click.prevent="validateRepository"
            @submit.prevent
            class="btn btn-primary"
            :disabled="validating"
            :class="validating && 'pulse'"
        >
            Next
        </button>
    </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { repoFormStore } from '../../store/repoFormStore';
import { toastStore } from '../../store/toastStore';
const revalidateUrl = () => {
    if (!repoFormStore.repositoryUrlIsValid) {
        repoFormStore.validateRepositoryUrl();
    }
};
const validating = ref(false);

const validateRepository = async () => {
    repoFormStore.validateRepositoryUrl();
    if (repoFormStore.repositoryUrlIsValid) {
        validating.value = true;
        try {
            const response = await fetch('/api/validate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: repoFormStore.repoUrl.toLowerCase(),
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                toastStore.addToast(data.error ?? 'Something went wrong', 'danger');
                return;
            }
            console.log('valid');
            repoFormStore.repositoryIsValid = true;
        } catch (error) {
            toastStore.addToast('Something went wrong', 'danger');
        } finally {
            validating.value = false;
        }
    }
};
</script>
<style scoped>
button {
    align-self: end;
}
</style>
