import { reactive } from 'vue';

export const repoFormStore = reactive({
    markdownContent: '',
    repoUrl: '',
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
    setMarkdownContent(markdownContent: string) {
        this.markdownContent = markdownContent;
    },
});
