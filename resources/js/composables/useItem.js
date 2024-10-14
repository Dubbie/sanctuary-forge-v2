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
        bluntAffix: itemData.blunt_affix || null,
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

            // Add modifier descriptions
            lines.push(
                ...this.modifiers.map(
                    (modifier) =>
                        new DescriptionLine(
                            modifier.description,
                            DescriptionLine.COLORS.BLUE,
                        ),
                ),
            );

            return lines;
        },
    });

    const processAffixProperties = (sourceName, affix) => {
        console.log(`Generating properties for ${sourceName}`);
        if (!affix) {
            console.warn(`No affix data provided for ${sourceName}`);
            return;
        }
        affix.properties.forEach((propertyDescriptor, index) => {
            const { property } = useProperty(
                { name: sourceName, index },
                propertyDescriptor,
                propertyDescriptor.parameter,
                propertyDescriptor.min,
                propertyDescriptor.max,
            );
            item.properties.push(property);
        });
    };

    const generateModifiers = () => {
        const sources = [
            { name: SOURCE.AUTOMAGIC, data: [item.automagicAffix] },
            { name: SOURCE.BLUNT, data: item.hardcodedAffixes },
        ];

        sources.forEach(({ name, data }) => {
            if (Array.isArray(data)) {
                data.forEach((affix) => processAffixProperties(name, affix));
                handleModifiers(item.properties, name);
            } else {
                console.warn(`${name} data is not an array:`, data);
            }
        });
    };

    const handleModifiers = (properties, sourceName) => {
        const stats = properties
            .filter((property) => property.source.name === sourceName)
            .flatMap((property) => property.stats);
        let handledStats = [];

        for (const [group, { handler, expectedStats }] of Object.entries(
            HANDLER_REGISTRY,
        )) {
            if (group === 'DEFAULT') continue;

            const matchedStats = stats.filter((stat) =>
                expectedStats.includes(stat.record.name),
            );
            if (matchedStats.length === expectedStats.length) {
                const source = { name: sourceName };
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
