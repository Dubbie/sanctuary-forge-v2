import Modifier from '@/models/Modifier';

export class PoisonDamageHandler {
    create(stats) {
        // Define the necessary poison damage stats
        const poisonStatNames = [
            'poisonmindam',
            'poisonmaxdam',
            'poisonlength',
        ];

        // Retrieve the stats
        const poisonStats = poisonStatNames.map((name) =>
            stats.find((stat) => stat.record.name === name),
        );

        // Check if all necessary stats exist
        if (poisonStats.every(Boolean)) {
            const [poisonMin, poisonMax, poisonLength] = poisonStats;

            // Extract length and calculate damage
            const length = poisonLength.values[0].getFloat();
            const minMin = Math.floor((poisonMin.values[0].min / 256) * length);
            const minMax = Math.floor((poisonMin.values[0].max / 256) * length);
            const maxMin = Math.floor((poisonMax.values[0].min / 256) * length);
            const maxMax = Math.floor((poisonMax.values[0].max / 256) * length);

            // Format the values
            const formattedValueMin = this.formatDamageRange(minMin, minMax);
            const formattedValueMax = this.formatDamageRange(maxMin, maxMax);
            const formattedValue = this.formatCombinedDamage(
                formattedValueMin,
                formattedValueMax,
            );

            // Prepare the description
            const description = `Adds ${formattedValue} Poison Damage Over ${length / 25} Seconds`;

            return new Modifier('dmg_poison', poisonStatNames, description);
        }
    }

    formatDamageRange(min, max) {
        if (min === max) {
            return min.toString(); // If min and max are the same, return just the value
        }
        return `[${min}-${max}]`; // Otherwise, return the range
    }

    formatCombinedDamage(minValue, maxValue) {
        if (minValue === maxValue) {
            return minValue; // If both formatted values are the same, return one of them
        }
        return `${minValue} to ${maxValue}`; // Otherwise, return the combined string
    }
}
