<script lang="ts">
import OgmaHeader from './components/header/OgmaHeader.vue';
import RepoForm from './components/RepoForm.vue';
import MarkdownEditor from './components/MarkdownEditor.vue';
import ProgressIndicator from './components/ProgressIndicator.vue';
import { repoFormStore } from './store/repoFormStore';

export default {
    data() {
        return {
            repoFormStore,
        };
    },
    components: {
        OgmaHeader,
        RepoForm,
        MarkdownEditor,
        ProgressIndicator,
    },
};
</script>

<template>
    <OgmaHeader />
    <section>
        <Transition mode="out-in" appear>
            <MarkdownEditor v-if="!!repoFormStore.markdownContent" />
            <ProgressIndicator v-else-if="repoFormStore.isProcessing" />
            <RepoForm v-else-if="!repoFormStore.isProcessing" :repo-url="repoFormStore.repoUrl" />
        </Transition>
    </section>
</template>

<style scoped>
section {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 8rem;
    padding-bottom: 2rem;
    width: 100vw;
    min-height: calc(100vh - 10rem);
    background: url(/bg-ogma.webp) rgba(125, 211, 252, 1);
    background-size: cover;
    background-blend-mode: screen;
}

*[data-theme='dark'] section {
    background: url(bg-ogma.webp) #062437;
    background-size: cover;
    background-blend-mode: multiply;
}

@media only screen and (max-width: 1024px) {
    section {
        justify-content: center;
    }
}

@media only screen and (max-width: 640px) {
    section {
        padding-top: 6rem;
        min-height: calc(100vh - 8rem);
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
