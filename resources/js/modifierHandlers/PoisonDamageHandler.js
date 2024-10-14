import Modifier from '@/models/Modifier';

export class PoisonDamageHandler {
    handle(stats, source) {
        // All stats found, pool this
        const poisonMinDam = stats.find(
            (stat) => stat.record.name === 'poisonmindam',
        );
        const poisonMaxDam = stats.find(
            (stat) => stat.record.name === 'poisonmaxdam',
        );
        const poisonLength = stats.find(
            (stat) => stat.record.name === 'poisonlength',
        );

        const modStats = [
            {
                name: 'poisonmindam',
                value: poisonMinDam.values[0],
            },
            {
                name: 'poisonmaxdam',
                value: poisonMaxDam.values[0],
            },
            {
                name: 'poisonlength',
                value: poisonLength.values[0],
            },
        ];

        return new Modifier(
            'dmg_poison',
            modStats,
            'Adds X-Y poison damage',
            source,
        );
    }
}
