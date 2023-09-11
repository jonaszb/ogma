<script setup lang="ts">
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { taskStore } from '../../store/taskStore';
import ActionButtons from './ActionButtons.vue';
import { computed } from 'vue';

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    })
);
const compiledMarkdown = computed(() => marked.parse(taskStore.markdownContent));
</script>

<template>
    <div class="markdown-editor">
        <div class="output">
            <div ref="markdownContent" v-html="compiledMarkdown"></div>
            <ActionButtons />
        </div>
    </div>
</template>

<style>
.markdown-editor {
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji';
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 0.5rem;
    border: 2px solid rgb(203, 213, 225);
    color: var(--sky-950);
    width: min(calc(100% - 2rem), 56rem);
    box-shadow: inset 0 1px 4px 1px rgba(16, 22, 26, 0.1);

    & .output {
        padding: 0 2rem;
        width: calc(100% - 4rem);
        overflow: scroll;
        max-height: calc(100vh - 12rem);
    }

    & code:not(.hljs) {
        padding: 2px 4px;
        border-radius: 0.25rem;
    }
}

.markdown-editor:hover {
    .action-buttons {
        opacity: 1;
    }
}

*[data-theme='dark'] .markdown-editor {
    color: var(--sky-50);
    border-color: var(--sky-950);
    background-color: rgba(0, 0, 0, 0.75);
    box-shadow: inset 0 -2px 3px 1px rgba(255, 255, 255, 0.15);

    & code:not(.hljs) {
        background-color: hsl(216, 28%, 10%);
    }
}

*[data-theme='light'] .markdown-editor {
    & code.hljs {
        background-color: rgba(#f1f5f9, 0.7);
    }

    & code:not(.hljs) {
        background-color: #f1f5f9;
    }
}
</style>
