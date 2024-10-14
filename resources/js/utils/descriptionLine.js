export class DescriptionLine {
    static COLORS = {
        WHITE: 'white',
        BLUE: 'blue',
    };

    constructor(text, color = DescriptionLine.COLORS.WHITE) {
        this.text = text;
        this.textColorClass = this._getTextClass(color);
    }

    _getTextClass(color) {
        switch (color) {
            case DescriptionLine.COLORS.WHITE:
                return 'text-white';
            case DescriptionLine.COLORS.BLUE:
                return 'text-blue-400';
            default:
                return 'text-zinc-500';
        }
    }
}
