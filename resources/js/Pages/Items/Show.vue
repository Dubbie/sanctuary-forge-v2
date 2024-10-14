<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import ItemDisplay from '@/Components/ItemDisplay.vue';
import { useItem } from '@/composables/useItem';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const { item } = useItem(props.item);
</script>

<template>
    <AppLayout title="Item Details">
        <p class="mb-6 text-lg font-bold">Item Details</p>

        <div class="flex items-start">
            <ItemDisplay :item="item" />
        </div>

        <div class="bg-black text-xs">
            <code>
                <pre>{{ item }}</pre>
            </code>
        </div>
    </AppLayout>
</template>
