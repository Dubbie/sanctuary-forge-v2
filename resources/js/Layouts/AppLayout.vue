<script setup>
import AppHeader from '@/Components/AppHeader.vue';
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Sanctuary Forge',
    },
    wide: {
        type: Boolean,
        default: false,
    },
});

const containerClasses = computed(() => {
    if (props.wide) {
        return 'mx-auto w-full max-w-7xl';
    }

    return 'mx-auto w-full max-w-6xl';
});
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen bg-zinc-900 text-white">
        <div class="bg-black/20">
            <div class="px-4 py-4 sm:px-6 lg:px-8" :class="containerClasses">
                <AppHeader />
            </div>
        </div>
        <div class="p-4 sm:p-6 lg:p-8" :class="containerClasses">
            <slot />
        </div>
    </div>
</template>
