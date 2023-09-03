<script lang="ts">
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import ClipboardIcon from './icons/ClipboardIcon.vue';
import CrossIcon from './icons/CrossIcon.vue';
import DownloadIcon from './icons/DownloadIcon.vue';
import { repoFormStore } from '../store/repoFormStore';

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    })
);

export default {
    data() {
        return {
            showClipboardPopover: false,
            clipboardTimer: 0,
        };
    },

    methods: {
        clearMarkdown() {
            repoFormStore.resetProgress();
            repoFormStore.setMarkdownContent('');
        },
        copyMarkdownToClipboard() {
            clearTimeout(this.clipboardTimer);
            navigator.clipboard.writeText(repoFormStore.markdownContent);
            this.showClipboardPopover = true;
            this.clipboardTimer = setTimeout(() => {
                this.showClipboardPopover = false;
            }, 2000);
        },
        downloadMarkdown() {
            const blob = new Blob([repoFormStore.markdownContent], { type: 'text/plain' });
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = 'README.md';
            link.click();

            URL.revokeObjectURL(link.href);
        },
    },
    computed: {
        compiledMarkdown() {
            return marked.parse(repoFormStore.markdownContent);
        },
    },
    components: {
        ClipboardIcon,
        CrossIcon,
        DownloadIcon,
    },
};
</script>

<template>
    <div class="markdown-editor">
        <div class="output">
            <div ref="markdownContent" v-html="compiledMarkdown"></div>
        </div>
        <div class="buttons-wrapper">
            <button @click="downloadMarkdown"><DownloadIcon /></button>
            <button @click="copyMarkdownToClipboard">
                <ClipboardIcon />
            </button>
            <button @click="clearMarkdown"><CrossIcon /></button>
        </div>
        <span class="popover" :class="showClipboardPopover && 'active'">Copied to clipboard</span>
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

    & .buttons-wrapper {
        position: absolute;
        display: flex;
        gap: 0.5rem;
        right: 1rem;
        top: 0.5rem;
        transition: opacity 0.1s ease-in-out;
        opacity: 0;
    }

    & button {
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

    & .popover {
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
}

.markdown-editor:hover {
    .buttons-wrapper {
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

    & button {
        background-color: var(--sky-950);
        stroke: var(--sky-50);
        border: 2px solid rgba(0, 0, 0, 0.75);

        &:hover {
            background-color: var(--sky-900);
            filter: brightness(1.1);
        }
    }

    & .popover {
        background-color: var(--sky-950);
        border: 1px solid var(--sky-900);
        color: var(--sky-100);
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

@media only screen and (max-width: 1024px) {
    .markdown-editor .buttons-wrapper {
        opacity: 1;
    }
}
</style>
