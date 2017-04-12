export default checkpointScoreMapper =
    ({uuid, score, remarks, checkpoint}) =>
        Object.assign({
            uuid: uuid,
            score: score,
            remarks: remarks,
            checkpoint: checkpoint
        });