import { reactive } from 'vue';

export const repoFormStore = reactive({
    markdownContent: '',
    repoUrl: '',
    additionalInfo: '',
    isProcessing: false,
    resetProgress() {
        this.isProcessing = false;
    },
    setRepoUrl(repoUrl: string) {
        this.repoUrl = repoUrl;
    },
    setAdditionalInfo(info: string) {
        this.additionalInfo = info;
    },
    setMarkdownContent(markdownContent: string) {
        this.markdownContent = markdownContent;
    },
    appendMarkdown(markdownFragment: string) {
        this.markdownContent += markdownFragment;
    },
});
