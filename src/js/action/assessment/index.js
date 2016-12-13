import ChecklistService from "../../service/ChecklistService";
import _ from 'lodash';
import Immutable from 'immutable';
import AssessmentService from "../../service/AssessmentService";

const startAssessment = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    const assessmentService = beans.get(AssessmentService);
    const assessment = assessmentService.startAssessment(actionParams.checklist, actionParams.facility, actionParams.assessmentType);
    const checklist = checklistService.getChecklist(actionParams.checklist.uuid);
    const checkpoints = _.mapValues(_.groupBy(assessmentService.getAllCheckpointsForAssessment(assessment), (obj)=>obj.checkpoint), (obj)=>obj[0]);
    return Object.assign(state, {
        progress: {
            total: checklistService.getAllCheckpointsForChecklist(checklist).length,
            completed: Object.keys(checkpoints).length
        },
        checklist: checklist,
        assessment: Object.assign(assessment, {checkpoints: checkpoints})
    });
};

const selectCompliance = function (state, actionParams, beans) {
    const assessmentService = beans.get(AssessmentService);
    const savedCheckpoint = assessmentService.saveCheckpointScore(state.assessment, actionParams.checkpoint, actionParams.compliance);
    const newState = Immutable.fromJS(state)
        .set("assessment", Immutable.Map(state.assessment)
            .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
                .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
    const completedCheckpoints = Object.keys(assessmentService.getAllCheckpointsForAssessment(newState.assessment)).length;
    return Object.assign(newState, {progress: {completed: completedCheckpoints, total: newState.progress.total}});
};

const addRemarks = function (state, actionParams, beans) {
    const assessmentService = beans.get(AssessmentService);
    const savedCheckpoint = assessmentService.saveCheckpointRemarks(state.assessment, actionParams.checkpoint, actionParams.remarks);
    return Immutable.fromJS(state)
        .set("assessment", Immutable.Map(state.assessment)
            .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
                .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
};

const submitAssessment = function (state, actionParams, beans) {
    const assessmentService = beans.get(AssessmentService);
    const assessment = assessmentService.endAssessment(state.assessment);
    actionParams.cb();
    return Object.assign(state);
};

export default new Map([
    ["START_ASSESSMENT", startAssessment],
    ["SELECT_COMPLIANCE", selectCompliance],
    ["ADD_REMARKS", addRemarks],
    ["SUBMIT_ASSESSMENT", submitAssessment]
]);

export let assessmentInit = {
    checklist: {areasOfConcern: [], name: ""},
    progress: {total: 0, completed: 0}
};