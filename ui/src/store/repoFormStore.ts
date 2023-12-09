import { reactive } from 'vue';

export const repoFormStore = reactive({
    repoUrl: '',
    additionalInfo: '',
    isProcessing: false,
    repositoryUrlIsValid: true,
    repositoryIsValid: false,
    additionalInfoIsValid: true,
    formIsValid: () => repoFormStore.repositoryUrlIsValid && repoFormStore.additionalInfoIsValid,
    resetProgress() {
        this.isProcessing = false;
        this.repositoryIsValid = false;
    },
    setRepoUrl(repoUrl: string) {
        this.repoUrl = repoUrl;
    },
    setAdditionalInfo(info: string) {
        this.additionalInfo = info;
    },
    validateRepositoryUrl() {
        const githubRepoRegex = /^(?:https?:\/\/)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/)?/;
        this.repositoryUrlIsValid = githubRepoRegex.test(this.repoUrl.toLowerCase());
    },
    validateAdditionalInfo() {
        if (this.additionalInfo.length > 2000) {
            this.additionalInfoIsValid = false;
        } else {
            this.additionalInfoIsValid = true;
        }
    },
});
