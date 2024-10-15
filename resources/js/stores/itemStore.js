import { useItem } from '@/composables/useItem';
import { defineStore } from 'pinia';
import { useAffixStore } from './affixStore';

export const useItemStore = defineStore('item', {
    state: () => ({
        selectedItem: null,
        selectedAutomod: null,
    }),
    actions: {
        setItem(item) {
            const { item: _item } = useItem(item);
            this.selectedItem = _item;

            if (this.selectedItem) {
                const affixStore = useAffixStore();
                affixStore.loadAvailableAutomods(this.selectedItem.id);
            }
        },

        setSelectedAutomod(automod) {
            if (!automod) {
                this.selectedAutomod = null;
                return;
            }

            const affixStore = useAffixStore();
            affixStore.setSelectedAffix(automod);
            this.selectedAutomod = affixStore.selectedAffix;
        },

        updateAutomagicModifier(statName, value) {
            const affixStore = useAffixStore();
            affixStore.updateAffixModifier(statName, value);
        },
    },
});
