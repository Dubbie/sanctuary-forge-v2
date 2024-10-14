<script setup>
import AppButton from './AppButton.vue';
import ItemDisplay from './ItemDisplay.vue';
import Modal from './Modal.vue';

defineProps({
    item: Object,
    show: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['close']);
</script>

<template>
    <Modal :show="show" @close="$emit('close')">
        <div class="p-4">
            <p>Item Editor</p>

            <div v-if="item">
                <div class="flex justify-start">
                    <ItemDisplay :item="item" />
                </div>
            </div>

            <div class="flex justify-end space-x-2">
                <AppButton plain @click="$emit('close')">Close</AppButton>
                <AppButton color="white">Save Item</AppButton>
            </div>
        </div>
    </Modal>
</template>
