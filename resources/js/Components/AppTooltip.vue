<script setup>
import { computed } from 'vue';

const props = defineProps({
    position: {
        type: String,
        default: 'right',
    },
});

const positionClass = computed(() => {
    return {
        right: 'top-1/2 -translate-y-1/2 left-full',
    }[props.position];
});
</script>

<template>
    <div
        class="absolute z-10 whitespace-nowrap bg-black p-2 text-center text-sm"
        :class="positionClass"
    >
        <slot />
    </div>
</template>
