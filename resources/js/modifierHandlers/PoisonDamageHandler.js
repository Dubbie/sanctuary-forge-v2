import Modifier from '@/models/Modifier';

export class PoisonDamageHandler {
    constructor() {
        this.poisonMin = {};
        this.poisonMax = {};
        this.poisonLength = {};
    }

    handle(stats, source) {
        // Extract relevant stats using destructuring
        const { poisonMin, poisonMax, poisonLength } = this.extractStats(stats);

        // Prepare the modifier stats
        const modStats = [
            { name: 'poisonmindam', value: poisonMin?.values[0] },
            { name: 'poisonmaxdam', value: poisonMax?.values[0] },
            { name: 'poisonlength', value: poisonLength?.values[0] },
        ].filter((stat) => stat.value !== undefined); // Filter out undefined values

        const description = this.getDescription(
            poisonMin,
            poisonMax,
            poisonLength,
        );
        return new Modifier('dmg_poison', modStats, description, source);
    }

    extractStats(stats) {
        const poisonMin = stats.find(
            (stat) => stat.record.name === 'poisonmindam',
        );
        const poisonMax = stats.find(
            (stat) => stat.record.name === 'poisonmaxdam',
        );
        const poisonLength = stats.find(
            (stat) => stat.record.name === 'poisonlength',
        );

        return { poisonMin, poisonMax, poisonLength };
    }

    getDescription(poisonMin, poisonMax, poisonLength) {
        const length = poisonLength?.values[0].getFloat() || 0;
        const minDamage = this.calculateDamage(poisonMin, length);
        const maxDamage = this.calculateDamage(poisonMax, length);

        const formattedValue = this.formatCombinedDamage(minDamage, maxDamage);
        return `Adds ${formattedValue} Poison Damage Over ${length / 25} Seconds`;
    }

    calculateDamage(stat, length) {
        if (!stat) return { min: 0, max: 0 }; // Handle missing stat gracefully
        const min = Math.floor((stat.values[0].min * length) / 256);
        const max = Math.floor((stat.values[0].max * length) / 256);
        return { min, max };
    }

    formatDamageRange(min, max) {
        return min === max ? min.toString() : `[${min}-${max}]`;
    }

    formatCombinedDamage(minStat, maxStat) {
        const formattedMin = this.formatDamageRange(minStat.min, minStat.max);
        const formattedMax = this.formatDamageRange(maxStat.min, maxStat.max);

        return formattedMin === formattedMax
            ? formattedMin
            : `${formattedMin} to ${formattedMax}`;
    }
}
