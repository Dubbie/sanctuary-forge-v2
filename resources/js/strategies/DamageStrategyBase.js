import Modifier from '@/models/Modifier';
import ModifierStrategy from './ModifierStrategy.js';

class DamageStrategyBase extends ModifierStrategy {
    constructor(modifierName, minStatName, maxStatName, damageType) {
        super();
        this.modifierName = modifierName;
        this.minStatName = minStatName;
        this.maxStatName = maxStatName;
        this.damageType = damageType;
    }

    apply(stats) {
        const minStat = stats.find(
            (stat) => stat.record.name === this.minStatName,
        );
        const maxStat = stats.find(
            (stat) => stat.record.name === this.maxStatName,
        );

        if (!minStat || !maxStat) {
            console.warn(`${this.damageType} damage needs both min and max!`);
            return null;
        }

        return new Modifier(this.modifierName, stats, (stats) =>
            this.getDescription(stats),
        );
    }

    getDescription(stats) {
        const minStat = stats.find(
            (stat) => stat.record.name === this.minStatName,
        );
        const maxStat = stats.find(
            (stat) => stat.record.name === this.maxStatName,
        );
        const formattedValue = this.formatCombinedDamage(minStat, maxStat);
        return `Adds ${formattedValue} ${this.damageType} Damage`;
    }

    formatDamageRange(min, max) {
        return min === max ? min.toString() : `[${min}-${max}]`;
    }

    formatCombinedDamage(minStat, maxStat) {
        const minMin = minStat.values[0].number || minStat.values[0].min;
        const minMax = minStat.values[0].number || minStat.values[0].max;
        const maxMin = maxStat.values[0].number || maxStat.values[0].min;
        const maxMax = maxStat.values[0].number || maxStat.values[0].max;
        const formattedMin = this.formatDamageRange(minMin, minMax);
        const formattedMax = this.formatDamageRange(maxMin, maxMax);

        return formattedMin === formattedMax
            ? formattedMin
            : `${formattedMin} to ${formattedMax}`;
    }
}

export default DamageStrategyBase;
