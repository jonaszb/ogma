<template>
    <div class="spinner"></div>
</template>

<script lang="ts">
export default {
    name: 'Spinner',
};
</script>

<style scoped>
.spinner {
    --spinner-color: var(--sky-600);
    border-radius: 50%;
    border: 2px solid transparent;
    border-top: 2px solid var(--spinner-color);
    border-bottom: 2px solid var(--spinner-color);
    animation: spin 1.3s ease-in-out infinite;

    &.lg {
        width: 8rem;
        height: 8rem;
        border-width: 6px;

        @media (width <= 640px) {
            width: 6rem;
            height: 6rem;
        }
    }
}

*[data-theme='dark'] .spinner {
    --spinner-color: var(--sky-100);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(540deg);
    }
}
</style>
