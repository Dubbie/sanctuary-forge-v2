import Affix from '@/models/Affix';
import { getModifiersByPropertyDescriptors } from '@/utils/modifierUtils';
import { defineStore } from 'pinia';

export const useAffixStore = defineStore('affix', {
    state: () => ({
        rawAffixes: [],
        availableAutomods: [],
        selectedAutomod: null,
        modifierManager: null,
    }),
    actions: {
        async loadAvailableAutomods(itemId) {
            const { data } = await axios.get(
                route('api.affixes.available', { item: itemId }),
            );
            this.rawAffixes = data;

            this.generateAffixesWithModifiers();
        },

        generateAffixesWithModifiers() {
            this.availableAutomods = [];
            this.selectedAutomod = null;

            // Generate modifiers for each affix
            for (const affix of this.rawAffixes) {
                this.generateModifiersByAffix(affix);
            }
        },

        generateModifiersByAffix(affix) {
            // Use the reusable function to get modifiers
            const modifiers = getModifiersByPropertyDescriptors(
                affix.properties,
            );
            const affixModel = new Affix(affix, modifiers);
            this.availableAutomods.push(affixModel);
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
