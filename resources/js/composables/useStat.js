import {
    COMBINE_TYPE,
    NUMBER_TYPE,
    useStatValue,
} from '@/composables/useStatValue';
import {
    sprintf,
    stringerClassOnly,
    stringerEmpty,
    stringerIntPercentageSigned,
    stringerIntSigned,
    stringerUnsignedFloat,
    stringerUnsignedInt,
} from '@/utils/stringUtils';
import { reactive } from 'vue';

const FORMAT_STRINGS = {
    ONE_COMPONENT: '%s',
    TWO_COMPONENT: '%s %s',
    THREE_COMPONENT: '%s %s %s',
    FOUR_COMPONENT: '%s %s %s %s',
};

const INT_VAL = NUMBER_TYPE.INT;
const SUM = COMBINE_TYPE.SUM;
const STATIC = COMBINE_TYPE.STATIC;

export function useStat(iscRecord, inputValues) {
    const Stat = reactive({
        record: iscRecord,
        values: [],

        toString: () => {
            return generateDescription();
        },

        clone() {
            const clonedStat = useStat(this.record, inputValues); // Pass iscRecord and inputValues
            // Copy all properties
            clonedStat.record = this.record;
            clonedStat.values = this.values.map((statValue) =>
                statValue.clone(),
            );
            return clonedStat.Stat;
        },
    });

    const init = () => {
        if (!iscRecord) {
            return;
        }

        Stat.values = [];

        // Create stat values based on the desc func id
        const descFuncId = Stat.record.desc_func_id;

        if (!descFuncId) {
            console.log(Stat.record);
        }

        switch (descFuncId) {
            case undefined:
            case 0:
                // special case for poisonlength, or other stats, which have a
                // 0-value descfnID field but need to store values
                for (let i = 0; i < inputValues.length; i++) {
                    Stat.values.push(
                        newStatValue(INT_VAL, SUM).setStringer(
                            stringerIntSigned,
                        ),
                    );
                }
                break;
            case 1:
                // +31 to Strength
                // Replenish Life +20 || Drain Life -8
                Stat.values[0] = newStatValue(INT_VAL, SUM)
                    .setHasMinMax(true)
                    .setStringer(stringerIntSigned);
                break;
            case 2:
                // +16% Increased Chance of Blocking
                // Lightning Absorb +10%
                Stat.values[0] = newStatValue(INT_VAL, SUM)
                    .setHasMinMax(true)
                    .setStringer(stringerIntPercentageSigned);
                break;
            case 3:
                // Damage Reduced by 25
                // Slain Monsters Rest in Peace
                Stat.values[0] = newStatValue(INT_VAL, SUM).setHasMinMax(true);
                break;
            case 4:
                // Poison Resist +25%
                // +25% Faster Run/Walk
                Stat.values[0] = newStatValue(INT_VAL, SUM)
                    .setHasMinMax(true)
                    .setStringer(stringerIntPercentageSigned);
                break;
            case 6:
                // +25 to Life (Based on Character Level)
                Stat.values[0] = newStatValue(INT_VAL, SUM).setStringer(
                    stringerIntSigned,
                );
                break;
            case 13:
                // +5 to Paladin Skill Levels
                Stat.values[0] = newStatValue(INT_VAL, SUM)
                    .setHasMinMax(true)
                    .setStringer(stringerIntSigned);
                Stat.values[1] = newStatValue(INT_VAL, SUM).setStringer(
                    stringerClassOnly,
                );
                break;
            case 14:
                // +5 to Combat Skills (Paladin Only)
                Stat.values[0] = newStatValue(INT_VAL, SUM)
                    .setHasMinMax(true)
                    .setStringer(stringerIntSigned);
                Stat.values[1] = newStatValue(INT_VAL, SUM).setStringer(
                    stringerClassOnly,
                );
                Stat.values[2] = newStatValue(INT_VAL, STATIC);

                break;
            case 15:
                // 5% Chance to cast level 7 Frozen Orb on attack
                Stat.values[0] = newStatValue(INT_VAL, SUM);
                Stat.values[1] = newStatValue(INT_VAL, SUM);
                Stat.values[2] = newStatValue(INT_VAL, STATIC);
                break;
            case 20:
                // -25% Target Defense
                Stat.values[0] = newStatValue(INT_VAL, SUM).setHasMinMax(true);
                break;
            default:
                throw new Error('Unknown stat descFuncId: ' + descFuncId);
        }

        // Helper function to set stat values
        const processInputValues = (statIndex, inputIndex) => {
            const value = Stat.values[statIndex];
            if (value.hasMinMax) {
                // Only add the min/max if it's not the same.
                if (inputValues[inputIndex] === inputValues[inputIndex + 1]) {
                    value.setFloat(inputValues[inputIndex]);
                } else {
                    value.setMin(inputValues[inputIndex]);
                    value.setMax(inputValues[inputIndex + 1]);
                }
                return 2; // Use 2 input values (min and max)
            } else {
                // Otherwise, set the single value normally
                value.setFloat(inputValues[inputIndex]);
                return 1; // Use 1 input value
            }
        };

        let statIndex = 0; // Tracks the current Stat.values index
        let inputIndex = 0; // Tracks the current inputValues index

        while (statIndex < Stat.values.length) {
            const usedInputs = processInputValues(statIndex, inputIndex);
            inputIndex += usedInputs; // Increment by 1 or 2 depending on used inputs
            statIndex++; // Always increment stat index by 1
        }
    };

    const newStatValue = (numberType, combineType) => {
        const { StatValue } = useStatValue();

        StatValue.numberType = numberType;
        StatValue.combineType = combineType;

        switch (numberType) {
            case NUMBER_TYPE.INT:
                StatValue.stringerFn = stringerUnsignedInt;
                break;
            case NUMBER_TYPE.FLOAT:
                StatValue.stringerFn = stringerUnsignedFloat;
                break;
            default:
                StatValue.stringerFn = stringerEmpty;
                break;
        }

        return StatValue;
    };

    const generateDescription = () => {
        let result = '';

        switch (Stat.record.desc_func_id) {
            case undefined:
            case 0:
                return result;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 12:
            case 20:
                result = descFn1();
                break;
            case 6:
            case 7:
            case 8:
                result = descFn6();
                break;
            case 13:
                result = descFn13();
                break;
            case 14:
                result = descFn14();
                break;
            case 15:
                result = descFn15();
                break;
            default:
                throw new Error(
                    'Unknown descFuncId for String generation: ' +
                        Stat.record.desc_func_id,
                );
        }

        return result;
    };

    const descFn1 = () => {
        const value = Stat.values[0];
        const min = value.min || value.getFloat();
        let str1 = min > 0 ? Stat.record.positive : Stat.record.negative;

        const formatString = FORMAT_STRINGS.TWO_COMPONENT;
        let result = '';
        switch (Stat.record.desc_val) {
            case 2:
                result = sprintf(formatString, str1, value);
                break;
            case 1:
                result = sprintf(formatString, value, str1);
                break;
            case 0:
                result = str1;
                break;
            default:
                break;
        }

        return result;
    };

    const descFn6 = () => {
        const value = Stat.values[0];
        let stringTableKey = null;
        let formatString = FORMAT_STRINGS.THREE_COMPONENT;

        if (value.getFloat() < 0) {
            stringTableKey = Stat.record.negative;
        } else {
            stringTableKey = Stat.record.positive;
        }

        const str1 = stringTableKey;
        const str2 = Stat.record.desc_str_2;

        let result = '';
        switch (Stat.record.desc_val) {
            case 2:
                result = sprintf(formatString, str1, value, str2);
                break;
            case 1:
                result = sprintf(formatString, value, str1, str2);
                break;
            case 0:
                formatString = FORMAT_STRINGS.TWO_COMPONENT;
                result = sprintf(formatString, value, str2);
                break;
            default:
                break;
        }

        return result;
    };

    const descFn13 = () => {
        // strings come out like `+5 to Combat Skills (Paladin Only)`
        const value = Stat.values[0];
        const allSkills = Stat.values[1];

        const formatString = FORMAT_STRINGS.TWO_COMPONENT;

        switch (Stat.record.desc_val) {
            case 2:
                return sprintf(formatString, value, allSkills);
            case 1:
                return sprintf(formatString, allSkills, value);
            case 0:
                return allSkills.toString();
            default:
                break;
        }
    };

    const descFn14 = () => {
        // strings come out like `+5 to Combat Skills (Paladin Only)`
        const numSkills = Stat.values[0];
        const hero = Stat.values[1];
        // const skillTab = Stat.values[2];

        // `+5`
        const numSkillsStr = numSkills.toString();

        // `to Combat Skills`
        const skillTabStr = 'to Combat Skills (unhandled)';

        // `Paladin Only`
        const heroStr = hero.toString();

        return sprintf(
            FORMAT_STRINGS.THREE_COMPONENT,
            numSkillsStr,
            skillTabStr,
            heroStr,
        );
    };

    const descFn15 = () => {
        const chance = Stat.values[0];
        const lvl = Stat.values[1];
        const skill = Stat.values[2];
        const chanceToCastStr = Stat.record.positive;
        return sprintf(chanceToCastStr, chance, lvl, skill);
    };

    init();

    return {
        Stat,
    };
}
