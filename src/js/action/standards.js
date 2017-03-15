import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import AssessmentService from "../service/AssessmentService";

const allStandards = function (state, action, beans) {
    const standards = beans.get(ChecklistService).getStandardsFor(action.checklist.uuid, action.areaOfConcern.uuid);
    const assessmentService = beans.get(AssessmentService);
    const standardsProgress = standards.map((standard) =>
        assessmentService.getStandardProgress(standard,
            action.areaOfConcern,
            action.checklist,
            action.facilityAssessment));
    return Object.assign(state, {"standards": _.zipWith(standards, standardsProgress, Object.assign)});
};

const updateProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    const updatedProgress = assessmentService.updateStandardProgress(action.standard, action.areaOfConcern, action.checklist, action.facilityAssessment);
    const newStandards = state.standards.map((standard) => standard.uuid === action.standard.uuid ?
        Object.assign(standard, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : standard);
    return Object.assign(state, {"standards": newStandards});
};

export default new Map([
    ["ALL_STANDARDS", allStandards],
    ["UPDATE_PROGRESS", updateProgress],
]);

export let standardsInit = {
    standards: []
};