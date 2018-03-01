import _ from "lodash";

class ReportScoreItem {
    constructor(uuid, reference, name, score) {
        this.uuid = uuid;
        this.reference = reference;
        this.name = name;
        this.score = score;
    }
}

export default ReportScoreItem;