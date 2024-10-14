import Modifier from '@/models/Modifier';

export class DefaultModifierHandler {
    constructor(handledStats) {
        this.handledStats = new Set(handledStats);
    }

    create(stats) {
        const defaultModifiers = [];

        // Iterate through all stats and create a modifier for each unhandled stat
        for (const stat of stats) {
            if (!this.handledStats.has(stat.record.name)) {
                // Check if stat is not already handled
                const modifier = this.createModifier(stat);
                if (modifier) {
                    defaultModifiers.push(modifier);
                }
            }
        }

        return defaultModifiers;
    }

    createModifier(stat) {
        return new Modifier(
            stat.record.name,
            [stat.record.name],
            stat.toString(),
        );
    }
}
