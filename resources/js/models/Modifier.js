class Modifier {
    constructor(name, stats, descFn) {
        this.name = name;
        this.stats = stats;
        this.descFn = descFn;
    }

    get description() {
        return this.descFn(this.stats);
    }

    clone() {
        return new Modifier(
            this.name,
            this.stats.map((stat) => stat.clone()),
            this.descFn,
        );
    }
}

export default Modifier;
