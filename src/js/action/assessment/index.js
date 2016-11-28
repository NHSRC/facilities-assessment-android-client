import ChecklistService from "../../service/ChecklistService";
import _ from 'lodash';
import Immutable from 'immutable';
import AssessmentService from "../../service/AssessmentService";

const startAssessment = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    const assessmentService = beans.get(AssessmentService);
    const assessment = assessmentService.startAssessment(actionParams.checklist, actionParams.facility, actionParams.assessmentType);

    var checklist = checklistService.getChecklist(actionParams.checklist.uuid);
    return Object.assign(state, {
        checklist: checklist,
        assessment: Object.assign(assessment, {checkpoints: {}})
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

const selectAssessmentMethod = function (state, actionParams, beans) {
    const assessmentService = beans.get(AssessmentService);
    const savedCheckpoint = assessmentService.saveCheckpointAssessmentMethod(state.assessment, actionParams.checkpoint, actionParams.assessmentMethods);
    return Immutable.fromJS(state)
        .set("assessment", Immutable.Map(state.assessment)
            .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
                .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
};

export default new Map([
    ["START_ASSESSMENT", startAssessment],
    ["SELECT_COMPLIANCE", selectCompliance],
    ["SELECT_ASSESSMENT_METHOD", selectAssessmentMethod],
]);

export let assessmentInit = {
    checklist: {areasOfConcern: [], name: ""},
};