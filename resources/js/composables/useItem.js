import { useProperty } from '@/composables/useProperty';
import {
    getHandlerAndStats,
    HANDLER_REGISTRY,
} from '@/modifierHandlers/handlerRegistry';
import { DescriptionLine } from '@/utils/descriptionLine';
import { reactive } from 'vue';

const SOURCE = {
    AUTOMAGIC: 'automagic',
    BLUNT: 'blunt',
    AFFIX: 'affix',
};

export function useItem(itemData) {
    const item = reactive({
        id: itemData.id || null,
        name: itemData.name || 'Unknown',
        category: itemData.category || 'unknown',
        requiredStrength: itemData.required_strength || 0,
        block: itemData.block || 0,
        level: itemData.level || 1,
        requiredLevel: itemData.required_level || 1,
        requiredDexterity: itemData.required_dexterity || 1,
        imageUrl: itemData.image_url || '',
        automagicAffix: itemData.automagic_affix || null,
        bluntAffix: itemData.blunt_affix || null, // Assuming you have this
        properties: [],
        type: itemData.type || null,
        hardcodedAffixes: itemData.hardcoded_affixes || [],
        attributes: {
            damageOneHand: {
                min: itemData.min_damage || 0,
                max: itemData.max_damage || 0,
            },
            damageTwoHand: {
                min: itemData.min_2hand_damage || 0,
                max: itemData.max_2hand_damage || 0,
            },
            damageMissile: {
                min: itemData.min_missile_damage || 0,
                max: itemData.max_missile_damage || 0,
            },
            defense: {
                min: itemData.min_ac || 0,
                max: itemData.max_ac || 0,
            },
        },
        modifiers: [],

        // Helper methods for generating descriptions...
        generateDamageDescription(type, min, max) {
            return min > 0
                ? new DescriptionLine(`${type} Damage: ${min} to ${max}`)
                : null;
        },

        generateRequirementDescription(statName, statValue) {
            return statValue > 1
                ? new DescriptionLine(`${statName}: ${statValue}`)
                : null;
        },

        get description() {
            const lines = [];

            lines.push(new DescriptionLine(this.name));

            const { min: defMin, max: defMax } = this.attributes.defense;
            if (defMin > 0) {
                lines.push(
                    new DescriptionLine(`Defense: [${defMin}-${defMax}]`),
                );
            }

            const damageTypes = [
                { type: 'One-Hand', data: this.attributes.damageOneHand },
                { type: 'Two-Hand', data: this.attributes.damageTwoHand },
                { type: 'Throwing', data: this.attributes.damageMissile },
            ];

            damageTypes.forEach(({ type, data }) => {
                const { min, max } = data;
                const damageDescription = this.generateDamageDescription(
                    type,
                    min,
                    max,
                );
                if (damageDescription) lines.push(damageDescription);
            });

            const requirementDescriptions = [
                this.generateRequirementDescription(
                    'Required Strength',
                    this.requiredStrength,
                ),
                this.generateRequirementDescription(
                    'Required Dexterity',
                    this.requiredDexterity,
                ),
                this.generateRequirementDescription(
                    'Required Level',
                    this.requiredLevel,
                ),
            ].filter(Boolean);

            lines.push(...requirementDescriptions);

            return lines;
        },
    });

    const generatePropertiesForSource = (sourceName, sourceData) => {
        console.log(`Generating properties for ${sourceName}`);

        const addProperties = (affix) => {
            affix.properties.forEach((propertyDescriptor, index) => {
                const inputParams = [
                    propertyDescriptor.parameter,
                    propertyDescriptor.min,
                    propertyDescriptor.max,
                ];
                const { property } = useProperty(
                    { name: sourceName, index },
                    propertyDescriptor,
                    ...inputParams,
                );
                item.properties.push(property);
            });
        };

        if (sourceData) {
            console.log(sourceData);

            addProperties(sourceData);
        }
    };

    const generateModifiers = () => {
        const sources = [
            {
                name: SOURCE.AUTOMAGIC,
                data: [item.automagicAffix],
            }, // Convert object to array
            { name: SOURCE.BLUNT, data: item.hardcodedAffixes },
        ];

        // Handle each source
        sources.forEach(({ name, data }) => {
            if (Array.isArray(data)) {
                data.forEach((affix) => {
                    generatePropertiesForSource(name, affix); // Process properties for each source
                });
            } else {
                console.warn(`${name} data is not an array:`, data); // Log if not an array
            }
        });

        // Handling modifiers for each property type
        sources.forEach(({ name, data }) => {
            if (Array.isArray(data)) {
                // Ensure data is an array
                const stats = item.properties.filter(
                    (property) => property.source.name === name,
                );
                handleModifiers(stats, name);
            } else {
                console.warn(`No stats found for ${name}:`, data);
            }
        });
    };

    const handleModifiers = (properties, sourceName) => {
        const stats = properties.flatMap((property) => property.stats); // Gather stats from properties
        let handledStats = [];
        let index = 0;

        for (const [group, { handler, expectedStats }] of Object.entries(
            HANDLER_REGISTRY,
        )) {
            if (group === 'DEFAULT') continue;

            const matchedStats = stats.filter((stat) =>
                expectedStats.includes(stat.record.name),
            );
            if (matchedStats.length === expectedStats.length) {
                const source = { name: sourceName, index };
                const modifier = new handler(matchedStats).handle(
                    matchedStats,
                    source,
                );
                handledStats.push(...expectedStats);
                item.modifiers.push(modifier);
            }
        }

        // Add remaining stats as regular modifiers
        addDefaultModifiers(stats, handledStats, sourceName);
    };

    const addDefaultModifiers = (stats, handledStats, sourceName) => {
        const { handler: DefaultHandler } = getHandlerAndStats('DEFAULT');
        const remainingStats = stats.filter(
            (stat) => !handledStats.includes(stat.record.name),
        );
        const defaultHandler = new DefaultHandler();
        const defaultModifiers = defaultHandler.handle(
            remainingStats,
            sourceName,
        );
        item.modifiers.push(...defaultModifiers);
    };

    const init = () => {
        generateModifiers();
    };

    init();

    return {
        item,
    };
}
