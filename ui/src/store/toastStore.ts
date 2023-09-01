import { reactive } from 'vue';

export const toastStore = reactive({
    nextId: 0,
    toasts: [] as Toast[],
    addToast(message: string, toastType: ToastType) {
        const id = this.nextId++;
        this.toasts.unshift({ message, toastType, id });
        if (this.toasts.length > 1) {
            this.toasts.pop();
        }
        setTimeout(() => {
            this.removeToast(id);
        }, 5000);
    },
    removeToast(toastId: number) {
        this.toasts = this.toasts.filter((toast) => toast.id !== toastId);
    },
});

type Toast = {
    id: number;
    message: string;
    toastType: ToastType;
};
type ToastType = 'danger'; // Other types to be implemented as needed
