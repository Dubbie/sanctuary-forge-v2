import DamageStrategyBase from './DamageStrategyBase';

class ColdDamageStrategy extends DamageStrategyBase {
    constructor() {
        super('dmg_cold', 'coldmindam', 'coldmaxdam', 'Cold');
    }
}

export default ColdDamageStrategy;
