import _ from 'lodash';

class General {
    static formatDate(date) {
        return `${General.toTwoChars(date.getDate())}-${General.toTwoChars(date.getMonth() + 1)}-${date.getFullYear()}`;
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
        return typeof obj === 'object' ? JSON.stringify(obj) : obj;
    }
}

export default General;