<template>
    <button id="theme-toggle" aria-label="Theme toggle" @click="toggleTheme()">
        <SunIcon v-if="userTheme === 'light'" />
        <MoonIcon v-else />
    </button>
</template>

<script setup lang="ts">
import SunIcon from '../icons/SunIcon.vue';
import MoonIcon from '../icons/MoonIcon.vue';
import { onMounted, ref, watch } from 'vue';

const userTheme = ref(localStorage.getItem('user-theme') || 'light');

onMounted(() => {
    const initUserTheme = getTheme() || getMediaPreference();
    userTheme.value = initUserTheme;
    document.documentElement.dataset.theme = initUserTheme;
});

function loadStyleSheet(src: string, theme: 'light' | 'dark') {
    watch(userTheme, (newTheme) => {
        if (newTheme === theme) {
            const linkElement = document.getElementById('theme-stylesheet');

            if (linkElement) {
                linkElement.setAttribute('href', src);
            } else {
                const link = document.createElement('link');
                link.id = 'theme-stylesheet';
                link.href = src;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                document.head.appendChild(link);
            }
        }
    });
}

loadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css', 'light');
loadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css', 'dark');

function toggleTheme() {
    const activeTheme = localStorage.getItem('user-theme');
    if (activeTheme === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

function getTheme() {
    return localStorage.getItem('user-theme');
}

function setTheme(theme: 'light' | 'dark') {
    localStorage.setItem('user-theme', theme);
    userTheme.value = theme;
    document.documentElement.dataset.theme = theme;
}

function getMediaPreference() {
    const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (hasDarkPreference) {
        return 'dark';
    } else {
        return 'light';
    }
}
</script>
<style scoped>
button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

svg {
    fill: var(--sky-900);
}

[data-theme='dark'] svg {
    fill: var(--sky-50);
}
</style>
