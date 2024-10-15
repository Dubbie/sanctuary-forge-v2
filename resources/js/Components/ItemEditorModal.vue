<script setup>
import { computed } from 'vue';
import AppButton from './AppButton.vue';
import ItemDisplay from './ItemDisplay.vue';
import Modal from './Modal.vue';
import { useItemStore } from '@/stores/itemStore';
import SelectInput from './SelectInput.vue';

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const itemStore = useItemStore();

const item = computed(() => {
    return itemStore.selectedItem;
});

const selectedAutomod = computed(() => {
    return itemStore.selectedAutomod;
});
const automodOptions = computed(() => {
    return itemStore.availableAutomods.map((automod) => {
        return {
            label: automod.description,
            value: automod,
        };
    });
});

const updateAutomagicModifier = (name, value) => {
    itemStore.updateAutomagicModifier(name, value);
};

// Validation Logic
const validateInput = (value, min, max) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < min || parsedValue > max) {
        return false;
    }
    return true;
};

const handleInput = (stat, value) => {
    const isValid = validateInput(
        value,
        stat.values[0].min,
        stat.values[0].max,
    );
    if (isValid) {
        updateAutomagicModifier(stat.record.name, value);
    } else {
        console.error(
            `Invalid value: ${value}. Must be between ${stat.values[0].min} and ${stat.values[0].max}`,
        );
    }
};

defineEmits(['close']);
</script>

<template>
    <Modal :show="show" @close="$emit('close')">
        <div class="px-8 py-4">
            <p class="mb-6 text-xl font-semibold">Item Editor</p>

            <div v-if="item">
                <div class="flex justify-start">
                    <ItemDisplay :item="item" />
                </div>

                <div class="mt-6">
                    <p
                        class="mb-2 border-b border-white/10 text-lg font-semibold"
                    >
                        Auto Mod
                    </p>

                    <div v-if="!selectedAutomod">
                        <SelectInput
                            :model-value="selectedAutomod"
                            @update:model-value="itemStore.setSelectedAutomod"
                            :options="automodOptions"
                            empty-label="Choose an auto mod..."
                        />
                    </div>

                    <div v-else>
                        <div
                            v-for="modifier in selectedAutomod.modifiers"
                            :key="modifier"
                            @click="itemStore.setSelectedAutomod(null)"
                        >
                            <p class="text-sm font-medium">
                                {{ modifier.description }}
                            </p>

                            <template
                                v-for="stat in modifier.stats"
                                :key="stat.record.name"
                            >
                                <div
                                    v-if="
                                        stat.values[0].hasMinMax &&
                                        stat.values[0].min !== null &&
                                        stat.values[0].max !== null
                                    "
                                    @click.stop
                                >
                                    <input
                                        :value="stat.values[0].number"
                                        :min="stat.values[0].min"
                                        :max="stat.values[0].max"
                                        type="number"
                                        class="rounded-lg border-white/15 bg-transparent px-2 py-1"
                                        @input="
                                            handleInput(
                                                stat,
                                                $event.target.value,
                                            )
                                        "
                                    />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex justify-end space-x-2">
                <AppButton plain @click="$emit('close')">Close</AppButton>
                <AppButton color="white">Save Item</AppButton>
            </div>
        </div>
    </Modal>
</template>
