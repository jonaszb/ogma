<script lang="ts">
import OgmaHeader from './components/header/OgmaHeader.vue';
import RepoForm from './components/repo-form/RepoForm.vue';
import MarkdownEditor from './components/markdown/MarkdownEditor.vue';
import ProgressIndicator from './components/ProgressIndicator.vue';
import ToastContainer from './components/toast/ToastContainer.vue';
import { repoFormStore } from './store/repoFormStore';
import { taskStore } from './store/taskStore';

export default {
    data() {
        return {
            repoFormStore,
            taskStore,
        };
    },
    components: {
        OgmaHeader,
        RepoForm,
        MarkdownEditor,
        ProgressIndicator,
        ToastContainer,
    },
};
</script>

<template>
    <OgmaHeader />
    <section>
        <ToastContainer />
        <Transition mode="out-in" appear>
            <MarkdownEditor v-if="!!taskStore.markdownContent" />
            <ProgressIndicator v-else-if="repoFormStore.isProcessing" />
            <RepoForm
                v-else-if="!repoFormStore.isProcessing"
                :repo-url="repoFormStore.repoUrl"
                :info="repoFormStore.additionalInfo"
            />
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
    min-height: calc(100dvh - 10rem);
    background: url(/bg-ogma.webp) rgba(125, 211, 252, 1);
    background-size: cover;
    background-blend-mode: screen;
}

*[data-theme='dark'] section {
    background: url(/bg-ogma.webp) hsl(203, 81%, 18%);
    background-size: cover;
    background-blend-mode: multiply;
}

@media only screen and (max-width: 1024px) {
    section {
        padding-top: 25vh;
    }
}

@media only screen and (max-width: 640px) {
    section {
        padding-top: 25vh;
        min-height: calc(100vh - 8rem);
    }
}
</style>
