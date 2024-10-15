<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import ItemDisplay from '@/Components/ItemDisplay.vue';
import { useItemStore } from '@/stores/itemStore';
import AppButton from '@/Components/AppButton.vue';
import ItemEditorModal from '@/Components/ItemEditorModal.vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const itemStore = useItemStore();
const itemModel = computed(() => itemStore.selectedItem);
const showingEditorModal = ref(false);

onMounted(() => {
    itemStore.setItem(props.item);
});
</script>

<template>
    <AppLayout title="Item Details">
        <p class="mb-6 text-lg font-bold">Item Details</p>

        <div class="flex items-start">
            <ItemDisplay v-if="itemModel" :item="itemModel" />

            <AppButton outline color="white" @click="showingEditorModal = true"
                >Craft item</AppButton
            >
        </div>

        <ItemEditorModal
            :show="showingEditorModal"
            @close="showingEditorModal = false"
        />
    </AppLayout>
</template>
