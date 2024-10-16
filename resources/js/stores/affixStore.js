import Affix from '@/models/Affix';
import { getModifiersByPropertyDescriptors } from '@/utils/modifierUtils';
import { defineStore } from 'pinia';

export const useAffixStore = defineStore('affix', {
    state: () => ({
        rawAffixes: {
            prefixes: [],
            suffixes: [],
            automagic: [],
        },
        availableAffixes: {
            prefixes: [],
            suffixes: [],
            automagic: [],
        },
        modifierManager: null,
    }),
    actions: {
        async loadAvailableAffixes(itemId) {
            const { data } = await axios.get(
                route('api.affixes.available', { item: itemId }),
            );

            const { prefixes, suffixes, automagic } = data;
            this.rawAffixes = { prefixes, suffixes, automagic };

            // this.rawAffixes.suffixes.forEach((affix) => {
            //     affix.properties.forEach((prop) => {
            //         if (prop.code === 'dmg-max') {
            //             console.log(prop);
            //         }
            //     });
            // });

            this.generateAffixesWithModifiers();
        },

        generateAffixesWithModifiers() {
            this.availableAffixes = {
                prefixes: [],
                suffixes: [],
                automagic: [],
            };

            // Generate modifiers for each affix
            const keys = ['automagic', 'suffixes'];
            for (const key of keys) {
                for (const affix of this.rawAffixes[key]) {
                    this.generateModifiersByAffix(affix, key);
                }
            }
        },

        generateModifiersByAffix(affix, key) {
            // Use the reusable function to get modifiers
            const modifiers = getModifiersByPropertyDescriptors(
                affix.properties,
            );
            const affixModel = new Affix(affix, modifiers);
            this.availableAffixes[key].push(affixModel);
        },

        setSelectedAffix(affix) {
            if (!affix) {
                this.selectedAffix = null;
                return;
            }

            this.selectedAffix = affix.clone();
            this.selectedAffix.modifiers.forEach((modifier) => {
                modifier.stats.forEach((stat) => {
                    if (
                        stat.values[0].hasMinMax &&
                        stat.values[0].max &&
                        stat.values[0].min
                    ) {
                        stat.values[0].number = stat.values[0].max;
                    }
                });
            });
        },

        updateAffixModifier(statName, value) {
            this.selectedAffix.setExplicitValue(statName, value);
        },
    },
});
