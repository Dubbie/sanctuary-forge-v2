<script setup>
import { computed, ref } from 'vue';
import AppTooltip from '@/Components/AppTooltip.vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const showingTooltip = ref(false);

const imageUrl = computed(() => {
    return '/img/' + props.item.image + '.png';
});
</script>

<template>
    <div class="relative">
        <div
            class="flex flex-col items-center"
            @mouseenter="showingTooltip = true"
            @mouseleave="showingTooltip = false"
        >
            <img :src="imageUrl" alt="" />
            <p>{{ item.name }}</p>
        </div>

        <AppTooltip v-show="showingTooltip">
            <p v-for="line in item.description" :key="line">{{ line }}</p>
        </AppTooltip>
    </div>
</template>
