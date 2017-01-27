import ChecklistService from "../service/ChecklistService";
import _ from 'lodash';
import Immutable from 'immutable';
import AssessmentService from "../service/AssessmentService";
import CheckpointScore from '../models/CheckpointScore';

const getCheckpoints = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    const checkpoints = checklistService
        .getCheckpointsFor(actionParams.checklist.uuid, actionParams.areaOfConcern.uuid, actionParams.standard.uuid);
    const checkpointScores = checkpoints.map((checkpoint) =>
        CheckpointScore.create(checkpoint, actionParams.standard,
            actionParams.areaOfConcern, actionParams.facilityAssessment));
    return Object.assign(state, {
        checkpoints: checkpointScores,
    });
};

const updateCheckpoint = function (state, actionParams, beans) {
    const metaCheckpoint = actionParams.checkpoint.checkpoint;
    const checkpointToUpdate = Object.assign({},
        actionParams.checkpoint,
        {checkpoint: metaCheckpoint.uuid});
    const assessmentService = beans.get(AssessmentService);
    const savedCheckpoint = assessmentService.saveCheckpointScore(checkpointToUpdate);
    const checkpoints = state.checkpoints
        .map((checkpoint) =>
            checkpoint.uuid === actionParams.checkpoint.uuid ?
                Object.assign({}, savedCheckpoint, {checkpoint: metaCheckpoint}) : checkpoint);
    return Object.assign({}, state, {checkpoints: checkpoints});
};

export default new Map([
    ["GET_CHECKPOINTS", getCheckpoints],
    ["UPDATE_CHECKPOINT", updateCheckpoint],
    // ["ADD_REMARKS", addRemarks],
    // ["SAVE_CHECKLIST", saveChecklist]
]);

export let assessmentInit = {
    checkpoints: [],
};