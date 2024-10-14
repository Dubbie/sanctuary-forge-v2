import Modifier from '@/models/Modifier';

export class DefaultModifierHandler {
    handle(stats, sourceName, startIndex = 0) {
        const defaultModifiers = [];
        let index = startIndex;

        // Iterate through all stats and create a modifier for each unhandled stat
        for (const stat of stats) {
            const source = {
                name: sourceName,
                index: index,
            };

            const modifier = this.createModifier(stat, source);
            if (modifier) {
                defaultModifiers.push(modifier);
                index++;
            }
        }

        return defaultModifiers;
    }

    createModifier(stat, source) {
        return new Modifier(
            stat.record.name,
            [
                {
                    name: stat.record.name,
                    value: stat.values[0],
                },
            ],
            stat.toString(),
            source,
        );
    }
}
