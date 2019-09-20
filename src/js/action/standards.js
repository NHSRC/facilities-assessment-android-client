import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import AssessmentService from "../service/AssessmentService";
import Logger from "../framework/Logger";

const allStandards = function (state, action, beans) {
    const standards = beans.get(ChecklistService).getStandardsFor(action.checklist.uuid, action.areaOfConcern.uuid);
    const assessmentService = beans.get(AssessmentService);
    const standardsProgress = standards.map((standard) =>
        assessmentService.getStandardProgress(standard,
            action.areaOfConcern,
            action.checklist,
            action.facilityAssessment));
    return _.assignIn(state, {"standards": _.zipWith(standards, standardsProgress, _.assignIn)});
};

const updateProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    const updatedProgress = assessmentService.updateStandardProgress(action.standard, action.areaOfConcern, action.checklist, action.facilityAssessment, action.state);
    const newStandards = state.standards.map((standard) => standard.uuid === action.standard.uuid ?
        _.assignIn(standard, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : standard);
    return _.assignIn(state, {"standards": newStandards});
};

const reduceProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    const updatedProgress = assessmentService.reduceStandardProgress(action.standard, action.areaOfConcern, action.checklist, action.facilityAssessment);
    const newStandards = state.standards.map((standard) => standard.uuid === action.standard.uuid ?
        _.assignIn(standard, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : standard);
    return _.assignIn(state, {"standards": newStandards});
};

export default new Map([
    ["ALL_STANDARDS", allStandards],
    ["UPDATE_STANDARD_PROGRESS", updateProgress],
    ["REDUCE_STANDARD_PROGRESS", reduceProgress],
]);

export let standardsInit = {
    standards: []
};