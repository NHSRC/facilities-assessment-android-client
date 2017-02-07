import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentService from "../service/AssessmentService";
import _ from 'lodash';

const allChecklists = function (state, action, beans) {
    const checklists = beans.get(ChecklistService).getChecklistsFor(action.assessmentTool);
    const assessmentService = beans.get(AssessmentService);
    const checklistProgress = checklists
        .map((checklist) => assessmentService.getChecklistProgress(checklist, action.facilityAssessment));
    const completedChecklists = checklistProgress.filter(({progress: {completed, total}}) => completed === total).length;
    return Object.assign(state, {
        "checklists": _.zipWith(checklists, checklistProgress, Object.assign),
        "assessmentProgress": {total: checklists.length, completed: completedChecklists}
    });
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
    checklists: [],
    assessmentProgress: {total: 0, completed: 0}
};