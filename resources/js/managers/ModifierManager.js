class ModifierManager {
    constructor() {
        this.strategies = [];
    }

    registerStrategy(statName, strategy) {
        this.strategies[statName] = strategy;
    }

    applyStrategy(stats) {
        for (const [statName, strategy] of Object.entries(this.strategies)) {
            if (stats.some((stat) => stat.record.name === statName)) {
                const modifier = strategy.apply(stats);
                if (modifier) {
                    return modifier;
                }
            }
        }

        // If no strategy matches, handle the stat normally
        return null;
    }
}

export default ModifierManager;
