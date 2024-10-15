import { useItem } from '@/composables/useItem';
import { defineStore } from 'pinia';
import { useAffixStore } from './affixStore';

export const useItemStore = defineStore('item', {
    state: () => ({
        selectedItem: null,
        selectedAutomod: null,
    }),
    actions: {
        async setItem(item) {
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

        updateAutomagicModifier(statName, value) {
            const affixStore = useAffixStore();
            affixStore.updateAffixModifier(statName, value);
        },
    },
});
