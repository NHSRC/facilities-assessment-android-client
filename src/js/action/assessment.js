import ChecklistService from "../service/ChecklistService";
import _ from 'lodash';
import AssessmentService from "../service/AssessmentService";
import CheckpointScore from '../models/CheckpointScore';

const getCheckpoints = function (state, actions, beans) {
    const checklistService = beans.get(ChecklistService);
    const assessmentService = beans.get(AssessmentService);
    let toCheckpointNotDefined = _.isEmpty(actions.toCheckpoint);
    const toCheckpoint = toCheckpointNotDefined ? {} : actions.toCheckpoint;
    const actionParams = {...actions, ...toCheckpoint};
    const standard = checklistService.getStandard(actionParams.standard.uuid);
    const checkpoints = checklistService
        .getCheckpointsFor(actionParams.checklist.uuid, actionParams.areaOfConcern.uuid, actionParams.standard.uuid);
    const checkpointScores = checkpoints
        .map((checkpoint) => Object.assign({}, checkpoint,
            {measurableElement: checklistService.getMeasurableElement(checkpoint.measurableElement)}))
        .map((checkpoint) =>
            Object.assign(assessmentService
                    .getCheckpointScore(checkpoint, actionParams.standard,
                        actionParams.areaOfConcern, actionParams.checklist, actionParams.facilityAssessment),
                {checkpoint: checkpoint}))
        .map((checkpoint) => CheckpointScore.create(checkpoint.checkpoint, actionParams.standard,
            actionParams.areaOfConcern, actionParams.checklist, actionParams.facilityAssessment, checkpoint));
    const currentCheckpoint = toCheckpointNotDefined ?
        _.head(checkpointScores) :
        checkpointScores.find((checkpoint) => checkpoint.checkpoint.uuid === actionParams.toCheckpoint.uuid);
    return Object.assign(state, {
        checkpoints: checkpointScores,
        currentCheckpoint: currentCheckpoint,
        standard: standard,
        pageChanged: false
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
    return Object.assign({}, state, {checkpoints: checkpoints, pageChanged: false});
};

const changePage = function (state, actionParams, beans) {
    return Object.assign(state, {currentCheckpoint: actionParams.currentCheckpoint, pageChanged: true});
};

export default new Map([
    ["GET_CHECKPOINTS", getCheckpoints],
    ["UPDATE_CHECKPOINT", updateCheckpoint],
    ["CHANGE_PAGE", changePage],
]);

export let assessmentInit = {
    checkpoints: [],
    currentCheckpoint: undefined,
    standard: {name: '', reference: ''}
};