<script setup>
import { Head } from '@inertiajs/vue3';

defineProps({
    title: {
        type: String,
        default: 'Sanctuary Forge',
    },
});
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen bg-zinc-900 text-white">
        <div class="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
            <slot />
        </div>
    </div>
</template>
