export default checkpointScoreMapper =
    ({uuid, score, remarks, checkpoint, na}) =>
        Object.assign({
            uuid: uuid,
            score: score,
            remarks: remarks,
            checkpoint: checkpoint,
            na: na
        });