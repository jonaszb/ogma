<template>
    <div class="progress-wrapper">
        <Transition mode="out-in" appear>
            <p v-if="!repoFormStore.validatedRepo">Validating repository...</p>
            <p v-else-if="!repoFormStore.fetchedRepo">Analyzing repository...</p>
            <p v-else>Generating markdown...</p>
        </Transition>
    </div>
</template>

<script lang="ts">
import { repoFormStore } from '../store/repoFormStore';
export default {
    data() {
        return {
            repoFormStore,
        };
    },
};
</script>

<style scoped>
.progress-wrapper {
    display: flex;
    height: min(calc(100vh - 10rem), 25rem);
    flex-direction: column;
    justify-content: center;
    gap: 3rem;
    color: var(--sky-700);
}

p {
    font-size: 4rem;
    font-weight: 300;
    text-align: center;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

*[data-theme='dark'] .progress-wrapper {
    color: var(--sky-100);
}

@media only screen and (max-width: 764px) {
    p {
        font-size: 3rem;
        margin-top: 0;
    }
}
</style>
