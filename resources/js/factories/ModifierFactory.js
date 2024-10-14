import { DefaultModifierHandler } from '@/modifierHandlers/DefaultModifierHandler';

class ModifierFactory {
    constructor() {
        this.strategies = [
            // new PoisonDamageHandler(),
            // new AllResistanceHandler(),
        ];
    }

    createModifiers(stats) {
        const modifiers = [];
        const handledStats = new Set();

        // First, apply specific modifiers
        for (const strategy of this.strategies) {
            const result = strategy.create(stats);
            if (result) {
                modifiers.push(result); // Add single modifier
                handledStats.add(result.name); // Collect handled stat ID
                for (const stat of result.stats) {
                    handledStats.add(stat); // Collect handled stat IDs
                }
            }
        }

        // Create and apply DefaultModifierHandler with the handled stat IDs
        const defaultHandler = new DefaultModifierHandler(handledStats);
        const defaultModifiers = defaultHandler.create(stats);
        modifiers.push(...defaultModifiers); // Add default modifiers to the existing ones

        return modifiers;
    }
}

export default ModifierFactory;
