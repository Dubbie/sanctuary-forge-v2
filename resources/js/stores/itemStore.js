import { useItem } from '@/composables/useItem';
import { useProperty } from '@/composables/useProperty';
import ModifierManager from '@/managers/ModifierManager';
import Affix from '@/models/Affix';
import Modifier from '@/models/Modifier';
import PoisonDamageStrategy from '@/strategies/PoisonDamageStrategy';
import { defineStore } from 'pinia';

export const useItemStore = defineStore('item', {
    state: () => ({
        selectedItem: null,
        availableAutomods: [],
        selectedAutomod: null,
        rawAffixes: [],
        modifierManager: null,
    }),
    actions: {
        setItem(item) {
            const { item: _item } = useItem(item);
            this.selectedItem = _item;

            if (this.selectedItem) {
                this.loadAvailableAffixes();
            }
        },

        async loadAvailableAffixes() {
            if (!this.selectedItem) {
                return;
            }

            const { data } = await axios.get(
                route('api.affixes.available', {
                    item: this.selectedItem.id,
                }),
            );

            this.rawAffixes = data;

            this.generateAffixesWithModifiers();
        },

        generateAffixesWithModifiers() {
            // Initialize ModifierManager
            this.modifierManager = new ModifierManager();
            this.modifierManager.registerStrategy(
                'poisonmindam',
                new PoisonDamageStrategy(),
            );
            this.modifierManager.registerStrategy(
                'poisonmaxdam',
                new PoisonDamageStrategy(),
            );
            this.modifierManager.registerStrategy(
                'poisonlength',
                new PoisonDamageStrategy(),
            );

            this.availableAutomods = [];
            this.selectedAutomod = null;

            // Generate modifiers for each affix
            for (const affix of this.rawAffixes) {
                this.generateModifiersByAffix(affix);
            }
        },

        generateModifiersByAffix(affix) {
            // Create the modifiers from the affix's property descriptors
            const modifiers = this.getModifiersByPropertyDescriptors(
                affix.properties,
            );

            // Add the modifiers to the affix
            const affixModel = new Affix(affix, modifiers);

            this.availableAutomods.push(affixModel);
        },

        // Generic function to handle creating modifiers, apply strategies here later.
        getModifiersByPropertyDescriptors(propertyDescriptors) {
            const properties =
                this.generatePropertiesByPropertyDescriptors(
                    propertyDescriptors,
                );

            const modifiers = this.generateModifiersByProperties(properties);

            return modifiers;
        },

        generatePropertiesByPropertyDescriptors(propertyDescriptors) {
            let properties = [];

            propertyDescriptors.forEach((propertyDescriptor) => {
                const { property } = useProperty(
                    propertyDescriptor,
                    propertyDescriptor.parameter,
                    propertyDescriptor.min,
                    propertyDescriptor.max,
                );

                properties.push(property);
            });

            return properties;
        },

        generateModifiersByProperties(properties) {
            let modifiers = [];

            // Get a flat map of all the stats
            const stats = properties.flatMap((property) => property.stats);

            const modifier = this.modifierManager.applyStrategy(stats);
            if (modifier) {
                modifiers.push(modifier);
            } else {
                // Create the modifiers from the stats
                for (const stat of stats) {
                    const modifier = new Modifier(
                        stat.record.name,
                        [stat],
                        () => {
                            return stat.toString();
                        },
                    );

                    modifiers.push(modifier);
                }
            }

            return modifiers;
        },

        setSelectedAutomod(automod) {
            if (!automod) {
                this.selectedAutomod = null;
                return;
            }

            console.log('Original automod:', automod);

            this.selectedAutomod = automod.clone();
            // Set explicit value to be the max.
            for (const stat of this.selectedAutomod.modifiers[0].stats) {
                if (
                    stat.values[0].hasMinMax &&
                    stat.values[0].max &&
                    stat.values[0].min
                ) {
                    stat.values[0].number = stat.values[0].max;
                }
            }

            console.log('Cloned:', this.selectedAutomod);
        },

        updateAutomagicModifier(statName, value) {
            this.selectedAutomod.setExplicitValue(statName, value);
        },
    },
});
