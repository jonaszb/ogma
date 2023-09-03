<template>
    <div>
        <Transition appear>
            <div class="progress-wrapper">
                <Spinner class="lg" />
                <p>Analyzing repository</p>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { repoFormStore } from '../store/repoFormStore';
import Spinner from './spinner/Spinner.vue';
export default {
    components: {
        Spinner,
    },
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
    align-items: center;
    gap: 1rem;
    color: var(--sky-700);
}

p {
    margin-top: 0;
    font-size: 4rem;
    font-weight: 300;
    text-align: center;
    line-height: normal;
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
    }
}
</style>
