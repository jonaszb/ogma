<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';
</script>

<template>
    <header>
        <span>ogma</span>
        <ThemeToggle />
    </header>
</template>

<style scoped>
header {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: calc(100vw - 3rem);
    padding: 0.75rem 1.5rem;
    transform: translateY(-0.5rem);
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
}

span {
    margin: 0;
    font-family: 'Raleway', sans-serif;
    font-size: 3rem;
    font-weight: 200;
    color: var(--sky-700);
}

*[data-theme='dark'] span {
    color: var(--sky-50);
}

*[data-theme='dark'] header {
    background-color: color-mix(in srgb, var(--sky-950), transparent 75%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media only screen and (max-width: 768px) {
    header {
        padding: 0.5rem 1rem;
        width: calc(100vw - 2rem);
        transform: none;
    }
    span {
        transform: translateY(-0.25rem);
        font-size: 2rem;
    }
}
</style>
