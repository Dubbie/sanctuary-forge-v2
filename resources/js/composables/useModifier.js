// import ModifierFactory from '@/factories/ModifierFactory';
// import { ref } from 'vue';

// export const useModifiers = (stats) => {
//     const modifiers = ref([]);

//     const modifierFactory = new ModifierFactory();

//     const createModifiers = () => {
//         // Clear previous modifiers
//         modifiers.value = [];

//         // Generate new modifiers based on stats
//         const modifier = modifierFactory.createModifier(stats);
//         modifiers.value.push(modifier);
//     };

//     // Initial creation of modifiers
//     createModifiers();

//     return {
//         modifiers,
//         createModifiers, // Allow manual refresh of modifiers if stats change
//     };
// };

import ModifierFactory from '@/factories/ModifierFactory';
import { ref } from 'vue';

export const useModifiers = () => {
    const modifiers = ref([]);
    const modifierFactory = new ModifierFactory();

    const createModifiers = (propertyDescriptor) => {
        // Clear previous modifiers
        modifiers.value = [];

        // Generate new modifiers based on stats
        const modifier = modifierFactory.createModifiers(stats);
        modifiers.value.push(modifier);
    };

    return {
        modifiers,
        createModifiers, // Allow manual refresh of modifiers if stats change
    };
};
