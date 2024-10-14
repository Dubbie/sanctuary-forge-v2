<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import ItemDisplay from '@/Components/ItemDisplay.vue';
import { onMounted, ref } from 'vue';
import { useItem } from '@/composables/useItem';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});

const itemMap = ref([]);

onMounted(() => {
    itemMap.value = props.items.map((_item) => {
        const { item } = useItem(_item);
        return item;
    });
});
</script>

<template>
    <AppLayout title="Items">
        <p class="mb-6 text-3xl font-bold">Items</p>

        <div class="flex flex-col items-start">
            <ItemDisplay
                v-for="item in itemMap"
                :key="item.id"
                :item="item"
                link
            />
        </div>
    </AppLayout>
</template>
