<script setup>
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue';
import { IconSelector } from '@tabler/icons-vue';
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
    },
    emptyLabel: {
        type: String,
        default: 'Please choose...',
    },
    options: Array,
});

const selectedOption = computed(() => {
    return props.options.find((option) => {
        return option.value === props.modelValue;
    });
});

const label = computed(() => {
    if (!selectedOption.value) {
        return props.emptyLabel;
    }

    return selectedOption.value.label;
});

const handleChange = (newValue) => {
    emit('update:model-value', newValue);
};

const emit = defineEmits(['update:model-value']);
</script>

<template>
    <Listbox
        :model-value="modelValue"
        @update:model-value="handleChange"
        as="div"
        class="relative"
        v-slot="{ open }"
    >
        <ListboxButton
            class="w-full rounded-xl border-none bg-transparent px-3 py-2 text-sm text-white ring-1 ring-inset"
            :class="{
                'ring-2 ring-indigo-500': open,
                'ring-white/10 hover:ring-white/30': !open,
            }"
        >
            <div class="flex justify-between">
                <p>{{ label }}</p>

                <IconSelector class="-mr-2 size-5 text-zinc-500" />
            </div>
        </ListboxButton>

        <transition
            leave-active-class="transition ease-in-out duration-300"
            leave-from-class="opacity-0"
            leave-to-class="opacity-100"
        >
            <ListboxOptions
                class="absolute left-0 top-full z-20 mt-1 max-h-64 overflow-y-scroll rounded-xl border border-white/15 bg-zinc-800 p-1 shadow-lg shadow-black/5"
            >
                <ListboxOption
                    v-for="option in options"
                    :key="option"
                    :value="option.value"
                    v-slot="{ active, selected }"
                >
                    <div
                        class="cursor-pointer rounded-lg px-2 py-1 text-sm"
                        :class="{
                            'bg-indigo-600 text-white': selected,
                            'bg-white/15': active && !selected,
                        }"
                    >
                        <p>{{ option.label }}</p>
                    </div>
                </ListboxOption>
            </ListboxOptions>
        </transition>
    </Listbox>
</template>
