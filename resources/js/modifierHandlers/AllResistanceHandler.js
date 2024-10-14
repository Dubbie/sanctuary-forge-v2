import Modifier from '@/models/Modifier';

export class AllResistanceHandler {
    create(stats) {
        const resistanceNames = [
            'fireresist',
            'lightresist',
            'coldresist',
            'poisonresist',
        ];

        // Find all resistance stats
        const resistances = resistanceNames.map((name) =>
            stats.find((stat) => stat.record.name === name),
        );

        // Check if all resistances exist
        if (resistances.every(Boolean)) {
            const value = resistances[0].values[0]; // Assuming all resistances have the same value
            const description = `All resistances +${value}`;
            const modifierName = `all_resist`;

            return new Modifier(modifierName, resistanceNames, description);
        }
    }
}
