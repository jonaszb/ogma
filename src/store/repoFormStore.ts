import { reactive } from 'vue';

export const repoFormStore = reactive({
    repoUrl: '',
    isProcessing: false,
    processRequest() {
        this.isProcessing = true;
        setTimeout(() => {
            this.isProcessing = false;
        }, 3000);
    },
    setRepoUrl(repoUrl: string) {
        this.repoUrl = repoUrl;
    },
});
