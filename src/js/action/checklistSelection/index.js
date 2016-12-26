import ChecklistService from "../../service/ChecklistService";
import ChecklistAssessmentService from "../../service/ChecklistAssessmentService";
import _ from 'lodash';

const allChecklists = function (state, action, beans) {
    const checklists = beans.get(ChecklistService).getChecklistsFor(action.assessmentTool);
    const checklistAssessmentService = beans.get(ChecklistAssessmentService);
    const checklistProgress = checklists
        .map((checklist) =>
            checklistAssessmentService._getExistingChecklistAssessment(checklist, action.facilityAssessment))
        .map(checklistAssessmentService.getChecklistProgress);
    return Object.assign(state, {"checklists": _.zipWith(checklists, checklistProgress, Object.assign)});
};

export default new Map([
    ["ALL_CHECKLISTS", allChecklists]
]);

export let checklistSelectionInit = {
    checklists: []
};