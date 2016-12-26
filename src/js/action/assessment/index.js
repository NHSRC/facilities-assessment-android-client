import ChecklistService from "../../service/ChecklistService";
import _ from 'lodash';
import Immutable from 'immutable';
import ChecklistAssessmentService from "../../service/ChecklistAssessmentService";

const startChecklistAssessment = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    const checklistAssessmentService = beans.get(ChecklistAssessmentService);
    const checklistAssessment = checklistAssessmentService.startChecklistAssessment(actionParams.checklist, actionParams.facilityAssessment);
    const checklist = checklistService.getChecklist(actionParams.checklist.uuid);
    const checkpoints = _.mapValues(_.groupBy(checklistAssessmentService.getAllCheckpointsForAssessment(checklistAssessment), (obj) => obj.checkpoint), (obj) => obj[0]);
    const lastUpdatedCheckpoint = checklistAssessmentService.getLatestUpdatedCheckpointForAssessment(checklistAssessment);
    var currentPointer = undefined;
    if (!_.isEmpty(lastUpdatedCheckpoint)) {
        currentPointer = {};
        currentPointer.currentStandard = checklistAssessmentService.getStandardForCheckpoint(lastUpdatedCheckpoint.checkpoint);
        currentPointer.currentAreaOfConcern = checklistAssessmentService.getAreaOfConcernForStandard(currentPointer.currentStandard.uuid);
    }
    const checklistProgress = checklistAssessmentService.getChecklistProgress(checklistAssessment);
    return Object.assign(state, {
        currentPointer: currentPointer,
        checklist: checklist,
        assessment: Object.assign(checklistAssessment, {checkpoints: checkpoints})
    }, checklistProgress);
};

const selectCompliance = function (state, actionParams, beans) {
    const checklistAssessmentService = beans.get(ChecklistAssessmentService);
    const savedCheckpoint = checklistAssessmentService.saveCheckpointScore(state.assessment, actionParams.checkpoint, actionParams.compliance);
    const newState = Immutable.fromJS(state)
        .set("assessment", Immutable.Map(state.assessment)
            .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
                .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
    const checklistProgress = checklistAssessmentService.getChecklistProgress(newState.assessment);
    return Object.assign(newState, checklistProgress);
};

const addRemarks = function (state, actionParams, beans) {
    const checklistAssessmentService = beans.get(ChecklistAssessmentService);
    const savedCheckpoint = checklistAssessmentService.saveCheckpointRemarks(state.assessment, actionParams.checkpoint, actionParams.remarks);
    return Immutable.fromJS(state)
        .set("assessment", Immutable.Map(state.assessment)
            .set("checkpoints", Immutable.Map(state.assessment.checkpoints)
                .set(savedCheckpoint.checkpoint, Immutable.Map(savedCheckpoint)))).toJS();
};

const saveChecklist = function (state, actionParams, beans) {
    actionParams.cb();
    return Object.assign({}, state);
};

export default new Map([
    ["START_CHECKLIST_ASSESSMENT", startChecklistAssessment],
    ["SELECT_COMPLIANCE", selectCompliance],
    ["ADD_REMARKS", addRemarks],
    ["SAVE_CHECKLIST", saveChecklist]
]);

export let assessmentInit = {
    assessment: {},
    checklist: {areasOfConcern: [], name: ""},
    progress: {total: 0, completed: 0},
    currentPointer: undefined
};