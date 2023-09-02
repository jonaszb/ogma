<template>
    <li>
        <i>
            <svg
                v-if="toastType === 'danger'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12ZM12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V12.75C12.75 13.1642 12.4142 13.5 12 13.5C11.5858 13.5 11.25 13.1642 11.25 12.75V9C11.25 8.58579 11.5858 8.25 12 8.25ZM12 16.5C12.4142 16.5 12.75 16.1642 12.75 15.75C12.75 15.3358 12.4142 15 12 15C11.5858 15 11.25 15.3358 11.25 15.75C11.25 16.1642 11.5858 16.5 12 16.5Z"
                />
            </svg>
        </i>
        <p>{{ message }}</p>
    </li>
</template>

<script lang="ts">
export default {
    props: {
        message: {
            type: String,
            required: true,
        },
        toastType: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
li {
    background-color: white;
    display: block;
    margin: 0;
    padding: 0.5rem 2rem 0.5rem 1rem;
    width: 21rem;
    min-height: 4rem;
    border-left: 6px solid transparent;
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    text-wrap: balance;
    color: black;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.2);

    @media (width <= 640px) {
        border-left: none;
        border-bottom: 6px solid;
    }

    & i {
        line-height: 0;
        margin-right: 1rem;
    }
}

li.danger {
    --danger-red: #dc2626;
    border-color: var(--danger-red);
    & svg {
        fill: var(--danger-red);
    }
}

*[data-theme='dark'] li {
    color: white;
    background-color: #030712;
    & i {
        background: radial-gradient(circle, rgba(255, 255, 255, 1) 50%, transparent 50%);
    }
}

@media only screen and (max-width: 640px) {
    li {
        width: calc(100vw - 3rem);
        font-size: 1rem;
    }
}
</style>
