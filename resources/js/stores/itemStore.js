import { useItem } from '@/composables/useItem';
import { defineStore } from 'pinia';
import { useAffixStore } from './affixStore';

export const useItemStore = defineStore('item', {
    state: () => ({
        loading: true,
        selectedItem: null,
        selectedAutomod: null,
        selectedSuffixes: [],
        selectedPrefixes: [],
    }),
    actions: {
        async setItem(item) {
            this.loading = true;

            const { item: _item } = useItem(item);
            this.selectedItem = _item;

            if (this.selectedItem) {
                const affixStore = useAffixStore();
                await affixStore.loadAvailableAffixes(this.selectedItem.id);

                if (affixStore.availableAffixes.automagic.length === 1) {
                    this.setSelectedAutomod(
                        affixStore.availableAffixes.automagic[0],
                    );
                }
            }

            this.loading = false;
        },

        setSelectedAutomod(automod) {
            const affixStore = useAffixStore();

            if (!automod) {
                if (affixStore.availableAffixes.automagic.length > 1) {
                    this.selectedAutomod = null;
                }
                return;
            }

            this.selectedAutomod = automod.clone();
        },

        addSuffix(suffix) {
            const clone = suffix.clone();
            console.log(clone);

            this.selectedSuffixes.push(clone);
        },

        addPrefix(prefix) {
            const clone = prefix.clone();
            console.log(clone);

            this.selectedPrefixes.push(clone);
        },

        updateAutomagicModifier(statName, value) {
            const affixStore = useAffixStore();
            affixStore.updateAffixModifier(statName, value);
        },
    },
});
