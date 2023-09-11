<template>
    <div class="buttons-wrapper">
        <button @click="downloadMarkdown"><DownloadIcon /></button>
        <button @click="copyMarkdownToClipboard">
            <ClipboardIcon />
        </button>
        <button @click="clearMarkdown"><CrossIcon /></button>
    </div>
    <span class="popover" :class="showClipboardPopover && 'active'">Copied to clipboard</span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { repoFormStore } from '../../store/repoFormStore';
import { taskStore } from '../../store/taskStore';
import ClipboardIcon from '../icons/ClipboardIcon.vue';
import CrossIcon from '../icons/CrossIcon.vue';
import DownloadIcon from '../icons/DownloadIcon.vue';

let clipboardTimer = 0;
const showClipboardPopover = ref(false);

const clearMarkdown = () => {
    repoFormStore.resetProgress();
    taskStore.closeEventSource();
    taskStore.setMarkdownContent('');
};

const copyMarkdownToClipboard = () => {
    clearTimeout(clipboardTimer);
    navigator.clipboard.writeText(taskStore.markdownContent);
    showClipboardPopover.value = true;
    clipboardTimer = setTimeout(() => {
        showClipboardPopover.value = false;
    }, 2000);
};

const downloadMarkdown = () => {
    const blob = new Blob([taskStore.markdownContent], { type: 'text/plain' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'README.md';
    link.click();

    URL.revokeObjectURL(link.href);
};
</script>

<style scoped>
.buttons-wrapper {
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
}

.markdown-editor:hover .buttons-wrapper {
    opacity: 1;
}

.buttons-wrapper {
    position: absolute;
    display: flex;
    gap: 0.5rem;
    right: 1rem;
    top: 0.5rem;
}

button {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--sky-50);
    border-radius: 100%;
    border: 2px solid rgba(255, 255, 255, 0.75);
    box-sizing: content-box;
    width: 2rem;
    aspect-ratio: 1;
    cursor: pointer;
    stroke: var(--sky-950);
    transition: all 0.1s ease-in-out;

    &:hover {
        background-color: var(--sky-100);
        filter: brightness(0.9);
    }

    &:active {
        transform: scale(0.95);
    }
}
.popover {
    position: absolute;
    right: 0.5rem;
    top: -2rem;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    background-color: var(--sky-100);
    border-radius: 2px;
    border: 1px solid var(--sky-200);
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
    color: var(--sky-950);
    display: none;

    &.active {
        display: block;
    }
}
*[data-theme='dark'] button {
    background-color: var(--sky-950);
    stroke: var(--sky-50);
    border: 2px solid rgba(0, 0, 0, 0.75);

    &:hover {
        background-color: var(--sky-900);
        filter: brightness(1.1);
    }
}

*[data-theme='dark'] .popover {
    background-color: var(--sky-950);
    border: 1px solid var(--sky-900);
    color: var(--sky-100);
}
@media only screen and (max-width: 1024px) {
    .buttons-wrapper {
        opacity: 1;
    }
}
</style>
