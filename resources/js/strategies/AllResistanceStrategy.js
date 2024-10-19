import { default as Modifier } from "@/models/Modifier";
import { default as ModifierStrategy } from "./ModifierStrategy";

class AllResistanceStrategy extends ModifierStrategy {
    apply(stats) {
        const fireRes = stats.find((stat) => stat.record.name === 'fireresist');
        const coldRes = stats.find((stat) => stat.record.name === 'coldresist');
        const lightRes = stats.find((stat) => stat.record.name === 'lightresist');
        const poisRes = stats.find((stat) => stat.record.name === 'poisonresist');

        if (!fireRes || !coldRes || !lightRes || !poisRes) {
            console.warn('Missing resistance from all resistance strategy!');
            return null;
        }

        return new Modifier('all_resist', stats, (stats) => this.getDescription(stats));
    }

    getDescription(stats) {
        const stat = stats.find((stat) => stat.record.name === 'fireresist');
        return 'All Resistance +' + stat.values[0].toString();
    }
}

export default AllResistanceStrategy;
