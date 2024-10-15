import Modifier from '@/models/Modifier';
import ModifierStrategy from './ModifierStrategy.js';

class PoisonDamageStrategy extends ModifierStrategy {
    apply(stats) {
        const poisonMin = stats.find(
            (stat) => stat.record.name === 'poisonmindam',
        );
        const poisonMax = stats.find(
            (stat) => stat.record.name === 'poisonmaxdam',
        );
        const poisonLength = stats.find(
            (stat) => stat.record.name === 'poisonlength',
        );

        if (!poisonMin || !poisonMax || !poisonLength) {
            console.warn('Some poison stats are missing!');
            return null;
        }

        return new Modifier('dmg_poison', stats, (stats) =>
            this.getDescription(stats),
        );
    }

    getDescription(stats) {
        console.log(stats);

        const poisonMin = stats.find(
            (stat) => stat.record.name === 'poisonmindam',
        );
        const poisonMax = stats.find(
            (stat) => stat.record.name === 'poisonmaxdam',
        );
        const poisonLength = stats.find(
            (stat) => stat.record.name === 'poisonlength',
        );

        const length = poisonLength?.values[0].getFloat() || 0;
        const minDamage = this.calculateDamage(poisonMin, length);
        const maxDamage = this.calculateDamage(poisonMax, length);

        const formattedValue = this.formatCombinedDamage(minDamage, maxDamage);
        return `Adds ${formattedValue} Poison Damage Over ${length / 25} Seconds`;
    }

    calculateDamage(stat, length) {
        if (!stat) return { min: 0, max: 0 }; // Handle missing stat gracefully
        const value = stat.values[0].getFloat();
        const min = Math.floor(((value || stat.values[0].min) * length) / 256);
        const max = Math.floor(((value || stat.values[0].max) * length) / 256);
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

export default PoisonDamageStrategy;
