import { reactive } from 'vue';
import { repoFormStore } from './repoFormStore';
import { toastStore } from './toastStore';

export const taskStore = reactive({
    markdownContent: '',
    eventSource: null as EventSource | null,
    resetProgress() {
        this.markdownContent = 'false';
    },

    listenForUpdates(task_id: string) {
        this.eventSource = new EventSource(`/api/events/${task_id}/`);
        this.eventSource.onmessage = (event) => {
            if (typeof event.data !== 'string') return;
            if (event.data.startsWith('md:')) {
                let message = event.data.slice(1027); // include padding of 1024 spaces
                if (message.startsWith('<br>')) {
                    message = message.slice(4);
                    this.appendMarkdown('\n');
                }
                this.appendMarkdown(message);
            } else if (event.data.startsWith('done')) {
                this.closeEventSource();
            } else if (event.data.startsWith('error')) {
                this.closeEventSource();
                repoFormStore.resetProgress();
                toastStore.addToast('Something went wrong', 'danger');
            }
        };
    },

    closeEventSource() {
        this.eventSource?.close();
        this.eventSource = null;
    },

    setMarkdownContent(markdownContent: string) {
        this.markdownContent = markdownContent;
    },
    appendMarkdown(markdownFragment: string) {
        this.markdownContent += markdownFragment;
    },
});
