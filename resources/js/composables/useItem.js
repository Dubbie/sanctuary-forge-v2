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

    const init = () => {};

    init();

    return {
        item,
    };
}
