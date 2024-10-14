<script setup>
const props = defineProps({
    descriptionLine: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <p :class="props.descriptionLine.textColorClass">
        {{ props.descriptionLine.text }}
    </p>
</template>
