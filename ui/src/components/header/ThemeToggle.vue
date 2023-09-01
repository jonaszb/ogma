<template>
    <button id="theme-toggle" aria-label="Theme toggle" @click="toggleTheme()">
        <SunIcon v-if="userTheme === 'light'" />
        <MoonIcon v-else />
    </button>
</template>

<script lang="ts">
import SunIcon from '../icons/SunIcon.vue';
import MoonIcon from '../icons/MoonIcon.vue';

export default {
    components: {
        SunIcon,
        MoonIcon,
    },
    mounted() {
        const initUserTheme = this.getTheme() || this.getMediaPreference();
        this.userTheme = initUserTheme;
        document.documentElement.dataset.theme = initUserTheme;
    },

    data() {
        return {
            userTheme: '',
        };
    },

    watch: {
        userTheme(newTheme) {
            function loadStyleSheet(src: string, theme: 'light' | 'dark'): void {
                if (newTheme === theme) {
                    // Try to get the existing link element
                    const linkElement = document.getElementById('theme-stylesheet') as HTMLLinkElement | null;

                    if (linkElement) {
                        // If the link element exists, update its href
                        linkElement.href = src;
                    } else {
                        // If the link element doesn't exist, create it
                        const link = document.createElement('link');
                        link.id = 'theme-stylesheet'; // Assign an ID for future reference
                        link.href = src;
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        document.head.appendChild(link);
                    }
                }
            }
            // document.addEventListener('DOMContentLoaded', function () {
            loadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css', 'light');
            loadStyleSheet(
                'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css',
                'dark'
            );
            // });
        },
    },

    methods: {
        toggleTheme() {
            const activeTheme = localStorage.getItem('user-theme');
            if (activeTheme === 'light') {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        },

        getTheme() {
            return localStorage.getItem('user-theme');
        },

        setTheme(theme: string) {
            localStorage.setItem('user-theme', theme);
            this.userTheme = theme;
            document.documentElement.dataset.theme = theme;
        },

        getMediaPreference() {
            const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (hasDarkPreference) {
                return 'dark';
            } else {
                return 'light';
            }
        },
    },
};
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
