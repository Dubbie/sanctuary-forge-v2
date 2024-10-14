export const sprintf = (format, ...args) => {
    let i = 0;
    return format.replace(/%[sd]/g, (match) => {
        if (match === '%%') {
            return '%'; // Literal % sign
        } else if (match === '%s') {
            return String(args[i++]); // Replace with string
        } else if (match === '%d') {
            return parseInt(args[i++], 10); // Replace with integer
        }
    });
};

export const stringerUnsignedFloat = (value) => {
    if (Array.isArray(value) && value[0] !== value[1]) {
        return sprintf('[%.2f-%.2f]', value[0], value[1]);
    }
    return sprintf('%.2f', value[0] || value);
};

export const stringerUnsignedInt = (value) => {
    if (Array.isArray(value) && value[0] !== value[1]) {
        return sprintf('[%d-%d]', value[0], value[1]);
    }
    return sprintf('%d', value[0] || value);
};

export const stringerIntSigned = (value) => {
    if (Array.isArray(value) && value[0] !== value[1]) {
        return sprintf('+[%d-%d]', value[0], value[1]);
    }

    return sprintf('+%d', value[0] || value);
};

export const stringerClassOnly = () => {
    return 'Test Class';
};

export const stringerEmpty = () => {
    return '';
};

export const stringerIntPercentageSigned = (value) => {
    if (Array.isArray(value) && value[0] !== value[1]) {
        return sprintf('[%d-%d]%', value[0], value[1]);
    }

    return sprintf('%d%', value[0] || value);
};
