import { reactive } from 'vue';

export const NUMBER_TYPE = {
    INT: 0,
    FLOAT: 1,
};

export const COMBINE_TYPE = {
    SUM: 0,
    STATIC: 1,
};

export const useStatValue = () => {
    const StatValue = reactive({
        min: null,
        max: null,
        hasMinMax: false,
        number: null,
        numberType: null,
        combineType: null,
        stringerFn: null,

        setFloat(float) {
            this.number = float;
            return this;
        },

        getFloat() {
            return this.number;
        },

        setMin(min) {
            this.min = min;
            return this;
        },

        setMax(max) {
            this.max = max;
            return this;
        },

        setHasMinMax(hasMinMax) {
            this.hasMinMax = hasMinMax;
            return this;
        },

        setStringer(fn) {
            this.stringerFn = fn;
            return this;
        },

        toString() {
            if (this.number) {
                return this.stringerFn(this.number);
            }

            return this.stringerFn([this.min, this.max]);
        },

        clone() {
            const clonedStatValue = useStatValue(); // Create a new StatValue instance

            // Copy all properties
            clonedStatValue.min = this.min;
            clonedStatValue.max = this.max;
            clonedStatValue.hasMinMax = this.hasMinMax;
            clonedStatValue.number = this.number;
            clonedStatValue.numberType = this.numberType;
            clonedStatValue.combineType = this.combineType;
            clonedStatValue.stringerFn = this.stringerFn; // Reference to the original stringer function

            return clonedStatValue;
        },
    });

    return {
        StatValue,
    };
};
