<template>
    <button id="theme-toggle" @click="toggleTheme()">
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
            userTheme: 'light',
        };
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
