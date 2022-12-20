import _ from 'lodash';

class ReportScoreItem {
    constructor(uuid, reference, name, score) {
        this.uuid = uuid;
        this.reference = reference;
        this.name = name;
        this.score = score;
    }

    static displayScore(score) {
        return parseFloat(score).toFixed(2);
    }

    displayScore() {
        return ReportScoreItem.displayScore(this.score);
    }

    displayTitle() {
        if (_.isEmpty(this.reference) || this.reference === this.name) return this.name;
        return `[${this.reference}] ${this.name}`;
    }
}

export default ReportScoreItem;
