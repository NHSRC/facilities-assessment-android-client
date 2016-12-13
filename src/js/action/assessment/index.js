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
        checklist: checklist,
        assessment: Object.assign(assessment, {checkpoints: checkpoints})
    });
};

const selectCompliance = function (state, actionParams, beans) {
    const assessmentService = beans.get(AssessmentService);
    const savedCheckpoint = assessmentService.saveCheckpointScore(state.assessment, actionParams.checkpoint, actionParams.compliance);
    return Immutable.fromJS(state)
        .set("assessment", Immutable.Map(state.assessment)
            .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
                .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
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
};