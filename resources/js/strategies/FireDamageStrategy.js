import DamageStrategyBase from './DamageStrategyBase';

class FireDamageStrategy extends DamageStrategyBase {
    constructor() {
        super('dmg_fire', 'firemindam', 'firemaxdam', 'Fire');
    }
}

export default FireDamageStrategy;
