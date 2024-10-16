import DamageStrategyBase from './DamageStrategyBase';

class LightningDamageStrategy extends DamageStrategyBase {
    constructor() {
        super('dmg_light', 'lightmindam', 'lightmaxdam', 'Lightning');
    }
}

export default LightningDamageStrategy;
