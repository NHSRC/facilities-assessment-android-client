import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentService from "../service/AssessmentService";
import _ from 'lodash';

const allChecklists = function (state, action, beans) {
    const checklistService = beans.get(ChecklistService);
    const assessmentService = beans.get(AssessmentService);
    const checklists = checklistService.getChecklistsFor(action.assessmentTool);
    const checklistProgress = checklists
        .map((checklist) => assessmentService.getChecklistProgress(checklist, action.facilityAssessment));
    const completedChecklists = checklistProgress
        .filter((checklistProgress) =>
        !_.isEmpty(checklistProgress.progress.total) && checklistProgress.completed === checklistProgress.total).length;
    checklistService.cacheAllChecklists(checklists);
    return Object.assign(state, {
        "checklists": _.zipWith(checklists, checklistProgress, Object.assign),
        "assessmentProgress": {total: checklists.length, completed: completedChecklists}
    });
};

const completeAssessment = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const endAssessment = facilityAssessmentService.endAssessment(action.facilityAssessment);
    action.cb();
    return Object.assign(state);
};

export default new Map([
    ["ALL_CHECKLISTS", allChecklists],
    ["COMPLETE_ASSESSMENT", completeAssessment],
    ["UPDATE_PROGRESS", allChecklists],
]);

export let checklistSelectionInit = {
    checklists: [],
    assessmentProgress: {total: 0, completed: 0}
};