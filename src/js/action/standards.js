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

export default new Map([
    ["ALL_STANDARDS", allStandards],
]);

export let standardsInit = {
    standards: []
};