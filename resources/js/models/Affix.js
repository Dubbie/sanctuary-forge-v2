class Affix {
    constructor(affix, modifiers) {
        this.affix = affix;
        this.modifiers = modifiers;
    }

    get description() {
        let descriptions = [];

        for (const modifier of this.modifiers) {
            descriptions.push(modifier.description);
        }

        return descriptions.join('/');
    }

    setExplicitValue(statName, explicitValue) {
        const stats = this.modifiers.flatMap((modifier) => modifier.stats);
        const stat = stats.find((stat) => stat.record.name === statName);
        if (stat) {
            stat.values[0].number = parseInt(explicitValue);
        }
    }

    clone() {
        return new Affix(
            { ...this.affix },
            this.modifiers.map((modifier) => modifier.clone()),
        );
    }
}

export default Affix;
