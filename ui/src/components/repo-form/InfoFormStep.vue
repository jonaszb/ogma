<template>
    <section>
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
        <div class="buttons-container">
            <button
                @click.prevent="
                    () => {
                        repoFormStore.repositoryIsValid = false;
                    }
                "
                class="btn btn-secondary"
            >
                {{ '<' }}
            </button>
            <button class="btn btn-primary">Generate readme</button>
        </div>
    </section>
</template>
<script setup lang="ts">
import { repoFormStore } from '../../store/repoFormStore';
</script>
<style scoped>
textarea {
    height: 12rem;
    resize: none;
    font-size: 1.5rem;
}

div {
    width: 100%;
}

.buttons-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

label {
    display: inline-block;
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
}

button {
    align-self: end;
}

@media only screen and (max-width: 640px) {
    label {
        font-size: 1.25rem;
    }

    textarea {
        height: 6rem;
        padding: 1rem;
        font-size: 1.25rem;
    }
}
</style>
