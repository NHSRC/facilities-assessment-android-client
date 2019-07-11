import _ from "lodash";

export default checkpointScoreMapper =
    ({uuid, score, remarks, checkpoint, na}) =>
        _.assignIn({
            uuid: uuid,
            score: score,
            remarks: remarks,
            checkpoint: checkpoint,
            na: na
        });