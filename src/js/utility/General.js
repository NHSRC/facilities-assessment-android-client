import _ from 'lodash';

const spaces = new RegExp('\\s', 'g');

class General {
    static formatDate(date) {
        return `${General.toTwoChars(date.getDate())}-${General.toTwoChars(date.getMonth() + 1)}-${date.getFullYear()}`;
    }

    static isoFormat(date) {
        return `${date.getFullYear()}-${General.toTwoChars(date.getMonth() + 1)}-${General.toTwoChars(date.getDate())}`;
    }

    static toTwoChars(number) {
        return `${number}`.length === 1 ? `0${number}` : `${number}`;
    }

    static formatRange(question) {
        return `[${question.lowAbsolute} - ${question.hiAbsolute}]`;
    }

    static pick(from, attributes, listAttributes) {
        const picked = _.pick(from, attributes);
        if (!_.isNil(listAttributes)) {
            listAttributes.forEach((listAttribute) => {
                picked[listAttribute] = [];
                from[listAttribute].forEach((item) => picked[listAttribute].push(item));
            });
        }
        return picked;
    }

    static getMessage(obj) {
        if (typeof obj === 'object') {
            let s = JSON.stringify(obj);
            if (s === '{}') return obj;
            return s;
        }
        return obj;
    }

    static removeSpaces(str) {
        return str.replace(spaces, '');
    }
}

export default General;