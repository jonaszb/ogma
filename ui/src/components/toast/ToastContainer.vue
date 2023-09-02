<template>
    <div class="toast-container" :class="toasts.length === 0 ? 'no-click' : ''">
        <TransitionGroup name="toasts" tag="ul">
            <Toast
                v-for="toast in toasts"
                :message="toast.message"
                :toast-type="toast.toastType"
                :key="toast.id"
                :class="toast.toastType"
            />
        </TransitionGroup>
    </div>
</template>

<script lang="ts">
import { TransitionGroup } from 'vue';
import { toastStore } from '../../store/toastStore';
import Toast from './Toast.vue';

export default {
    components: {
        Toast,
        TransitionGroup,
    },
    computed: {
        toasts() {
            return toastStore.toasts;
        },
    },
};
</script>

<style scoped>
.toast-container {
    position: fixed;
    left: 2rem;
    bottom: 2rem;

    & ul {
        gap: 1rem;
        display: flex;
        flex-direction: column-reverse;
        padding: 0;
        margin: 0;
        height: 10rem;
        width: 24rem;
    }
}

.no-click {
    pointer-events: none;
}

.toasts-move, /* apply transition to moving elements */
.toasts-enter-active,
.toasts-leave-active {
    transition: all 0.5s ease;
}

.toasts-enter-from {
    opacity: 0;
    transform: translateY(6rem);
}
.toasts-leave-to {
    opacity: 0;
    transform: translateY(-8rem);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.toasts-leave-active {
    position: absolute;
}

@media only screen and (max-width: 640px) {
    .toast-container {
        left: 0;
        bottom: auto;
        top: 0;

        & ul {
            width: 100vw;
            gap: 0;
            height: 5rem;
        }
    }
    .toasts-enter-from {
        transform: translateY(-6rem);
    }
}
</style>
