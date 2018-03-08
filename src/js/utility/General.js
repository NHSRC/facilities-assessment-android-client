import _ from 'lodash';
import moment from 'moment';

const spaces = new RegExp('\\s', 'g');

class General {
    static formatDate(date) {
        return `${General.toTwoChars(date.getDate())}-${General.toTwoChars(date.getMonth() + 1)}-${date.getFullYear()}`;
    }

    static getDisplayMonth(date) {
        return moment(date).format('MMMM YYYY');
    }

    static toTwoChars(number) {
        return `${number}`.length === 1 ? `0${number}` : `${number}`;
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