import { reactive } from 'vue';

export const repoFormStore = reactive({
    markdownContent: '',
    repoUrl: '',
    additionalInfo: '',
    isProcessing: false,
    validatedRepo: false,
    fetchedRepo: false,
    status: '',
    setStatus(status: string) {
        this.status = status;
    },
    resetProgress() {
        this.isProcessing = false;
        this.validatedRepo = false;
        this.fetchedRepo = false;
        this.setStatus('');
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
