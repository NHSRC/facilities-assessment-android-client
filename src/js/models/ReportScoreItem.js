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
}

export default ReportScoreItem;
