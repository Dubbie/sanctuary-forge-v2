import { useModifiers } from '@/composables/useModifier';
import { useProperty } from '@/composables/useProperty';
import { DescriptionLine } from '@/utils/descriptionLine';
import { reactive } from 'vue';

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
        properties: itemData.properties || [],
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

        // Helper method for generating damage descriptions
        generateDamageDescription(type, min, max) {
            if (min > 0) {
                return new DescriptionLine(`${type} Damage: ${min} to ${max}`);
            }
            return null;
        },

        // Helper method for generating stat descriptions
        generateRequirementDescription(statName, statValue) {
            if (statValue > 1) {
                return new DescriptionLine(`${statName}: ${statValue}`);
            }
            return null;
        },

        // Description getter
        get description() {
            const lines = [];

            // Add label
            lines.push(new DescriptionLine(this.name));

            // Add defense description
            const { min: defMin, max: defMax } = this.attributes.defense;
            if (defMin > 0) {
                lines.push(
                    new DescriptionLine(`Defense: [${defMin}-${defMax}]`),
                );
            }

            // Damage types
            const damageDescriptions = [
                this.generateDamageDescription(
                    'One-Hand',
                    this.attributes.damageOneHand.min,
                    this.attributes.damageOneHand.max,
                ),
                this.generateDamageDescription(
                    'Two-Hand',
                    this.attributes.damageTwoHand.min,
                    this.attributes.damageTwoHand.max,
                ),
                this.generateDamageDescription(
                    'Throwing',
                    this.attributes.damageMissile.min,
                    this.attributes.damageMissile.max,
                ),
            ].filter(Boolean);

            lines.push(...damageDescriptions);

            // Required stats
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

            const stats = item.properties.flatMap((property) => {
                return property.stats;
            });
            const { modifiers } = useModifiers(stats);
            modifiers.value.forEach((modifierArray) => {
                modifierArray.forEach((modifier) => {
                    lines.push(
                        new DescriptionLine(
                            modifier.description,
                            DescriptionLine.COLORS.BLUE,
                        ),
                    );
                });
            });

            // Filter out null values
            return lines.filter(Boolean);
        },
    });

    const generateProperties = () => {
        const addProperties = (affix) => {
            affix.properties.forEach((propertyDescriptor) => {
                const inputParams = [
                    propertyDescriptor.parameter,
                    propertyDescriptor.min,
                    propertyDescriptor.max,
                ];
                const { property } = useProperty(
                    propertyDescriptor,
                    ...inputParams,
                );
                item.properties.push(property);
            });
        };

        // Add properties from automagic affix
        if (item.automagicAffix) {
            addProperties(item.automagicAffix);
        }

        // Add properties from hardcoded affixes
        item.hardcodedAffixes.forEach(addProperties);
    };

    const updateAttributes = () => {
        // TODO: Handle this.
    };

    const init = () => {
        // Update the attributes based on the properties
        generateProperties();
        updateAttributes();
    };

    init();

    return {
        item,
    };
}
