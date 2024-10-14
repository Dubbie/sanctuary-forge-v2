<script setup>
import { computed, ref } from 'vue';
import AppTooltip from '@/Components/AppTooltip.vue';
import { Link } from '@inertiajs/vue3';
import DescriptionLine from '@/Components/DescriptionLine.vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    link: {
        type: Boolean,
        default: false,
    },
});

const showingTooltip = ref(false);

const linkUrl = computed(() => {
    if (props.link) {
        return route('items.show', {
            item: props.item.id,
        });
    }

    return null;
});
</script>

<template>
    <component :is="link ? Link : 'div'" class="relative" :href="linkUrl">
        <div
            class="flex flex-col items-center"
            @mouseenter="showingTooltip = true"
            @mouseleave="showingTooltip = false"
        >
            <img :src="item.imageUrl" alt="" />
            <p class="text-sm font-semibold">{{ item.name }}</p>
        </div>

        <AppTooltip v-show="showingTooltip">
            <DescriptionLine
                v-for="line in item.description"
                :key="line"
                :description-line="line"
            />
        </AppTooltip>
    </component>
</template>
