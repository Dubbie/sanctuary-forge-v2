import { DefaultModifierHandler } from './DefaultModifierHandler';
import { PoisonDamageHandler } from './PoisonDamageHandler';

export const HANDLER_REGISTRY = {
    DMG_POISON: {
        handler: PoisonDamageHandler,
        expectedStats: ['poisonmindam', 'poisonmaxdam', 'poisonlength'],
    },
    DEFAULT: {
        handler: DefaultModifierHandler,
        expectedStats: [],
    },
};

/**
 * Retrieves the handler and the expected stats for the given group.
 * @param {string} group - The group identifier for the handler.
 * @returns {object} An object containing the handler and expected stats.
 */
export function getHandlerAndStats(group) {
    return HANDLER_REGISTRY[group];
}
