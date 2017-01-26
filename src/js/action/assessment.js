import ChecklistService from "../service/ChecklistService";
import _ from 'lodash';
import Immutable from 'immutable';
import AssessmentService from "../service/AssessmentService";

const getCheckpoints = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    let checkpoints = checklistService
        .getCheckpointsFor(actionParams.checklist, actionParams.areaOfConcern.uuid, actionParams.standard.uuid);
    return Object.assign(state, {
        checkpoints: checkpoints,
    });
};

// const selectCompliance = function (state, actionParams, beans) {
//     const checklistAssessmentService = beans.get(AssessmentService);
//     const savedCheckpoint = checklistAssessmentService.saveCheckpointScore(state.assessment, actionParams.checkpoint, actionParams.compliance);
//     const newState = Immutable.fromJS(state)
//         .set("assessment", Immutable.Map(state.assessment)
//             .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
//                 .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
//     const checklistProgress = checklistAssessmentService.getChecklistProgress(newState.assessment);
//     return Object.assign(newState, checklistProgress);
// };
//
// const addRemarks = function (state, actionParams, beans) {
//     const checklistAssessmentService = beans.get(AssessmentService);
//     const savedCheckpoint = checklistAssessmentService.saveCheckpointRemarks(state.assessment, actionParams.checkpoint, actionParams.remarks);
//     return Immutable.fromJS(state)
//         .set("assessment", Immutable.Map(state.assessment)
//             .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
//                 .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
// };
//
// const saveChecklist = function (state, actionParams, beans) {
//     actionParams.cb();
//     return Object.assign({}, state);
// };

export default new Map([
    ["GET_CHECKPOINTS", getCheckpoints],
    // ["SELECT_COMPLIANCE", selectCompliance],
    // ["ADD_REMARKS", addRemarks],
    // ["SAVE_CHECKLIST", saveChecklist]
]);

export let assessmentInit = {
    checkpoints: [],
};