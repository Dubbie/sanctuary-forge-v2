import Modifier from '@/models/Modifier';
import ModifierStrategy from './ModifierStrategy.js';

class EnhancedDamageStrategy extends ModifierStrategy {
    apply(stats) {
        const edStat = stats.find(
            (stat) => stat.record.name === 'item_mindamage_percent',
        );

        if (!edStat) {
            console.warn('Some poison stats are missing!');
            return null;
        }

        return new Modifier('dmg_enhanced', stats, (stats) =>
            this.getDescription(stats),
        );
    }

    getDescription(stats) {
        const edStat = stats.find(
            (stat) => stat.record.name === 'item_mindamage_percent',
        );

        const minDamage = this.calculateDamage(edStat, length);
        const maxDamage = this.calculateDamage(edStat, length);

        const formattedValue = this.formatCombinedDamage(minDamage, maxDamage);
        return `${formattedValue}% Enhanced Damage`;
    }

    calculateDamage(stat) {
        if (!stat) return { min: 0, max: 0 }; // Handle missing stat gracefully
        const value = stat.values[0].getFloat();
        const min = Math.floor(value || stat.values[0].min);
        const max = Math.floor(value || stat.values[0].max);
        return { min, max };
    }

    formatDamageRange(min, max) {
        return min === max ? min.toString() : `[${min}-${max}]`;
    }

    formatCombinedDamage(minDmg, maxDmg) {
        const formattedMin = this.formatDamageRange(minDmg.min, minDmg.max);
        const formattedMax = this.formatDamageRange(maxDmg.min, maxDmg.max);

        return formattedMin === formattedMax
            ? formattedMin
            : `${formattedMin} to ${formattedMax}`;
    }
}

export default EnhancedDamageStrategy;
