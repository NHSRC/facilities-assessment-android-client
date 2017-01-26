import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import ChecklistAssessmentService from "../service/AssessmentService";
import _ from 'lodash';

const allChecklists = function (state, action, beans) {
    const checklists = beans.get(ChecklistService).getChecklistsFor(action.assessmentTool);
    const checklistAssessmentService = beans.get(ChecklistAssessmentService);
    const checklistProgress = checklists
        .map(checklistAssessmentService.getChecklistProgress);
    return Object.assign(state, {"checklists": _.zipWith(checklists, checklistProgress, Object.assign)});
};

const saveFacilityAssessment = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const endAssessment = facilityAssessmentService.endAssessment(action.assessment);
    action.cb();
    return Object.assign(state);
};

export default new Map([
    ["ALL_CHECKLISTS", allChecklists],
    ["SAVE_FACILITY_ASSESSMENT", saveFacilityAssessment]
]);

export let checklistSelectionInit = {
    checklists: []
};