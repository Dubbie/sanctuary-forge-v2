<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import ItemDisplay from '@/Components/ItemDisplay.vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});

console.log(props.items);
</script>

<template>
    <AppLayout title="Items">
        <p class="mb-6 text-3xl font-bold">Items</p>

        <div class="flex flex-col items-start">
            <ItemDisplay
                v-for="item in props.items"
                :key="item.id"
                :item="item"
            />
        </div>
    </AppLayout>
</template>
