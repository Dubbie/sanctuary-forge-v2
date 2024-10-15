import { reactive } from 'vue';
import { useStat } from './useStat';

const FUNCTIONS = {
    FN_NONE: 0,
    FN_VALUES_TO_STAT: 1,
    FN_ARMOR_PERCENT: 2,
    FN_REPEAT_PREVIOUS_WITH_MIN_MAX: 3,
    FN_UNUSED: 4,
    FN_DAMAGE_MIN: 5,
    FN_DAMAGE_MAX: 6,
    FN_DAMAGE_PERCENT: 7,
    FN_SPEED_RELATED: 8,
    FN_REPEAT_PREVIOUS_WITH_PARAM_MIN_MAX: 9,
    FN_CLASS_SKILL_TAB: 10,
    FN_PROCS: 11,
    FN_RANDOM_SKILL: 12,
    FN_MAX_DURABILITY: 13,
    FN_NUM_SOCKETS: 14,
    FN_STAT_MIN: 15,
    FN_STAT_MAX: 16,
    FN_STAT_PARAM: 17,
    FN_TIME_RELATED: 18,
    FN_CHARGE_RELATED: 19,
    FN_INDESTRUCTIBLE: 20,
    FN_CLASS_SKILLS: 21,
    FN_SINGLE_SKILL: 22,
    FN_ETHEREAL: 23,
    FN_STATE_APPLY_TO_TARGET: 24,
};

export function useProperty(propertyDescriptor, ...inputParams) {
    const property = reactive({
        record: propertyDescriptor.property_record || null,
        inputParams: inputParams,
        stats: [],
        propertyType: null,
    });

    const init = () => {
        property.stats = [];

        let lastFnCalled = null;

        property.record?.property_stat_records.forEach((psr) => {
            const evaluated = evalStat(psr, lastFnCalled);
            const stat = evaluated.stat;
            lastFnCalled = evaluated.func_id;
            if (stat !== null) {
                property.stats.push(stat);
            }
        });
    };

    const evalStat = (psr, lastFnCalled) => {
        let iscRecord = psr.stat_record;
        let funcId = psr.function_id;
        let stat = null;

        switch (funcId) {
            case FUNCTIONS.FN_REPEAT_PREVIOUS_WITH_MIN_MAX:
            case FUNCTIONS.FN_REPEAT_PREVIOUS_WITH_PARAM_MIN_MAX:
                funcId = lastFnCalled;
            /* falls through */
            case FUNCTIONS.FN_VALUES_TO_STAT:
            case FUNCTIONS.FN_SPEED_RELATED:
            case FUNCTIONS.FN_MAX_DURABILITY:
            case FUNCTIONS.FN_NUM_SOCKETS:
            case FUNCTIONS.FN_STAT_MIN:
            case FUNCTIONS.FN_STAT_MAX:
            case FUNCTIONS.FN_SINGLE_SKILL:
            case FUNCTIONS.FN_ARMOR_PERCENT:
                property.propertyType = 'compute_stats';
                stat = fnValuesToStat(iscRecord);
                break;
            case FUNCTIONS.FN_DAMAGE_MIN:
            case FUNCTIONS.FN_DAMAGE_MAX:
            case FUNCTIONS.FN_DAMAGE_PERCENT:
                property.propertyType = 'compute_integer';
                stat = fnComputeInteger(iscRecord);
                break;
            case FUNCTIONS.FN_PROCS:
                property.propertyType = 'compute_stats';
                stat = fnProcs(iscRecord);
                break;
            case FUNCTIONS.FN_CLASS_SKILL_TAB:
                property.propertyType = 'compute_stats';
                stat = fnClassSkillTab(iscRecord);
                break;
            case FUNCTIONS.FN_STAT_PARAM:
                property.propertyType = 'compute_stats';
                stat = fnStatParam(iscRecord);
                break;
            case FUNCTIONS.FN_CLASS_SKILLS:
                property.propertyType = 'compute_stats';
                stat = fnClassSkills(psr, iscRecord);
                break;
            default:
                throw new Error('Unknown stat function id: ' + funcId);
        }

        return {
            stat,
            func_id: psr.function_id,
        };
    };

    const fnValuesToStat = (iscRecord) => {
        let min = null;
        let max = null;
        let propParam = null;

        switch (property.inputParams.length) {
            case 0:
            case 1:
                return null;
            case 2:
                min = property.inputParams[0];
                max = property.inputParams[1];
                break;
            case 3:
                propParam = property.inputParams[0];
                min = property.inputParams[1];
                max = property.inputParams[2];
                break;
            default:
                min = property.inputParams[0];
                max = property.inputParams[1];
                break;
        }

        const { Stat } = useStat(iscRecord, [min, max, propParam]);

        return Stat;
    };

    const fnComputeInteger = (iscRecord) => {
        let min = null;
        let max = null;

        switch (property.inputParams.length) {
            case 0:
            case 1:
                return null;
            case 2:
                min = property.inputParams[0];
                max = property.inputParams[1];
                break;
            default:
                min = property.inputParams[0];
                max = property.inputParams[1];
                break;
        }

        const { Stat } = useStat(iscRecord, [min, max]);
        return Stat;
    };

    const fnProcs = (iscRecord) => {
        let skillId = null;
        let chance = null;
        let skillLevel = null;

        switch (property.inputParams.length) {
            case 0:
            case 1:
            case 2:
                return null;
            default:
                skillId = property.inputParams[0];
                chance = property.inputParams[1];
                skillLevel = property.inputParams[2];
        }

        const { Stat } = useStat(iscRecord, [skillId, chance, skillLevel]);
        return Stat;
    };

    const fnClassSkillTab = (iscRecord) => {
        // Amazon
        // 0 - Bow & Crossbow
        // 1 - Passive & Magic
        // 2 - Spear & Javelin
        // Sorceress
        // 3 - Fire
        // 4 - Lightning
        // 5 - Cold
        // Necromancer
        // 6 - Curses
        // 7 - Poison & Bone
        // 8 - Summoning
        // Paladin
        // 9 - Offensive Auras
        // 10 - Combat Skills
        // 11 - Defensive Auras
        // Barbarian
        // 12 - Masteries
        // 13 - Combat Skills
        // 14 - Warcries
        // Druid
        // 15 - Summoning
        // 16 - Shapeshifting
        // 17 - Elemental
        // Assassin
        // 18 - Traps
        // 19 - Shadow Disciplines
        // 20 - Martial Arts

        let param = property.inputParams[0];
        let min = property.inputParams[1];
        let max = property.inputParams[2];

        const skillTabIndex = param % 3;
        const heroIndex = Math.floor(param / 3);

        const { Stat } = useStat(iscRecord, [
            min,
            max,
            heroIndex,
            skillTabIndex,
        ]);
        return Stat;
    };

    const fnStatParam = (iscRecord) => {
        if (property.inputParams.length === 0) {
            return null;
        }

        const { Stat } = useStat(iscRecord, [property.inputParams]);
        return Stat;
    };

    const fnClassSkills = (psRecord, iscRecord) => {
        let min = null;
        let max = null;
        let classIdx = null;

        switch (property.inputParams.length) {
            case 0:
            case 1:
                return null;
            default:
                min = property.inputParams[0];
                max = property.inputParams[1];
        }

        classIdx = psRecord.value;

        const { Stat } = useStat(iscRecord, [min, max, classIdx]);
        return Stat;
    };

    init();

    return {
        property,
    };
}
