<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import ItemDisplay from '@/Components/ItemDisplay.vue';
import { useItem } from '@/composables/useItem';
import AppButton from '@/Components/AppButton.vue';
import ItemEditorModal from '@/Components/ItemEditorModal.vue';
import { ref } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const { item } = useItem(props.item);

const showingEditorModal = ref(false);
</script>

<template>
    <AppLayout title="Item Details">
        <p class="mb-6 text-lg font-bold">Item Details</p>

        <div class="flex items-start">
            <ItemDisplay :item="item" />

            <AppButton outline color="white" @click="showingEditorModal = true"
                >Craft item</AppButton
            >
        </div>

        <div class="bg-black text-xs">
            <code>
                <pre>{{ item }}</pre>
            </code>
        </div>

        <ItemEditorModal
            :show="showingEditorModal"
            :item="item"
            @close="showingEditorModal = false"
        />
    </AppLayout>
</template>
