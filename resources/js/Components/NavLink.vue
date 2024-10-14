<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    href: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
    },
});
</script>

<template>
    <Link
        :href="href"
        class="p-2 text-sm font-semibold"
        :class="{
            'text-white': active,
            'text-zinc-500 hover:text-zinc-200': !active,
        }"
    >
        <slot />
    </Link>
</template>
