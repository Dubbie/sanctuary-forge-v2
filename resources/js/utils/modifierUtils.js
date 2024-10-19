import { useProperty } from '@/composables/useProperty';
import ModifierManager from '@/managers/ModifierManager';
import Modifier from '@/models/Modifier';
import AllResistanceStrategy from '@/strategies/AllResistanceStrategy';
import ColdDamageStrategy from '@/strategies/ColdDamageStrategy';
import EnhancedDamageStrategy from '@/strategies/EnhancedDamageStrategy';
import FireDamageStrategy from '@/strategies/FireDamageStrategy';
import LightningDamageStrategy from '@/strategies/LightningDamageStrategy';
import PoisonDamageStrategy from '@/strategies/PoisonDamageStrategy';

/**
 * Generates modifiers based on property descriptors.
 *
 * @param {Array} propertyDescriptors - The property descriptors to generate modifiers from.
 * @returns {Array} modifiers - An array of generated modifiers.
 */
export function getModifiersByPropertyDescriptors(propertyDescriptors) {
    // Initialize ModifierManager and register strategies
    const modifierManager = new ModifierManager();

    // Define a configuration for registering strategies
    const strategyConfig = {
        poison: {
            strategy: new PoisonDamageStrategy(),
            stats: ['poisonmindam', 'poisonmaxdam', 'poisonlength'],
        },
        cold: {
            strategy: new ColdDamageStrategy(),
            stats: ['coldmindam', 'coldmaxdam', 'coldlength'],
        },
        fire: {
            strategy: new FireDamageStrategy(),
            stats: ['firemindam', 'firemaxdam'],
        },
        lightning: {
            strategy: new LightningDamageStrategy(),
            stats: ['lightmindam', 'lightmaxdam'],
        },
        enhanced: {
            strategy: new EnhancedDamageStrategy(),
            stats: ['item_mindamage_percent'],
        },
        allres: {
            strategy: new AllResistanceStrategy(),
            stats: ['fireresist', 'coldresist', 'lightresist', 'poisonresist']
        }
    };

    // Register strategies dynamically
    for (const { strategy, stats } of Object.values(strategyConfig)) {
        stats.forEach((stat) =>
            modifierManager.registerStrategy(stat, strategy),
        );
    }

    // Step 1: Generate properties by property descriptors
    const properties =
        generatePropertiesByPropertyDescriptors(propertyDescriptors);

    // Step 2: Generate modifiers from properties
    return generateModifiersByProperties(properties, modifierManager);
}

/**
 * Generates properties based on property descriptors.
 *
 * @param {Array} propertyDescriptors - The property descriptors to generate properties from.
 * @returns {Array} properties - An array of generated properties.
 */
function generatePropertiesByPropertyDescriptors(propertyDescriptors) {
    return propertyDescriptors.map((descriptor) => {
        const { property } = useProperty(
            descriptor,
            descriptor.parameter,
            descriptor.min,
            descriptor.max,
        );
        return property;
    });
}

/**
 * Generates modifiers from a list of properties.
 *
 * @param {Array} properties - The properties to generate modifiers from.
 * @param {ModifierManager} modifierManager - The manager responsible for applying strategies.
 * @returns {Array} modifiers - An array of generated modifiers.
 */
function generateModifiersByProperties(properties, modifierManager) {
    let modifiers = [];

    properties.forEach((property) => {
        property.stats.forEach((stat) => {
            if (!stat.record) {
                console.log('No stat record for this property!');
                console.log(property);
            }
        });
    });

    // Get a flat map of all the stats from the properties
    let stats = properties.flatMap((property) => property.stats);

    // Step 1: Apply strategies using the modifier manager and collect the processed stats
    const strategyAppliedModifier = modifierManager.applyStrategy(stats);

    if (strategyAppliedModifier) {
        modifiers.push(strategyAppliedModifier);
        // Filter out stats that were processed by the strategy
        const processedStatNames = strategyAppliedModifier.stats.map(
            (stat) => stat.record.name,
        );
        stats = stats.filter(
            (stat) => !processedStatNames.includes(stat.record.name),
        );
    }

    // Step 2: Create a default modifier for each stat that wasn't processed by a strategy
    stats.forEach((stat) => {
        const modifier = new Modifier(stat.record.name, [stat], () =>
            stat.toString(),
        );
        modifiers.push(modifier);
    });

    return modifiers;
}
