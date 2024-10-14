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
                this.stringerFn(this.number);
            }

            return this.stringerFn([this.min, this.max]);
        },
    });

    return {
        StatValue,
    };
};
