import _ from 'lodash';
import moment from "moment";

class General {
    static formatDate(date) {
        return `${General.toTwoChars(date.getDate())}-${General.toTwoChars(date.getMonth() + 1)}-${date.getFullYear()}`;
    }

    static formatRange(question) {
        return `[${question.lowAbsolute} - ${question.hiAbsolute}]`;
    }
}

export default General;