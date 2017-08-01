import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentService from "../service/AssessmentService";
import _ from 'lodash';

const allChecklists = function (state, action, beans) {
    const checklistService = beans.get(ChecklistService);
    const assessmentService = beans.get(AssessmentService);
    const checklists = checklistService.getChecklistsFor(action.assessmentTool, action.state);
    const checklistProgress = checklists
        .map((checklist) => assessmentService.getChecklistProgress(checklist, action.facilityAssessment));
    const completedChecklists = checklistProgress
        .filter((checklistProgress) =>
            _.isNumber(checklistProgress.progress.total) &&
            checklistProgress.progress.completed === checklistProgress.progress.total
        ).length;
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

const updateChecklistProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    let updatedProgress = assessmentService.updateChecklistProgress(action.checklist, action.facilityAssessment);
    const newChecklists = state.checklists.map((checklist) => checklist.uuid === action.checklist.uuid ?
        Object.assign(checklist, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : checklist);
    const completedChecklists = newChecklists
        .filter((checklistProgress) =>
            _.isNumber(checklistProgress.progress.total) &&
            checklistProgress.progress.completed === checklistProgress.progress.total
        ).length;
    return Object.assign(state, {
        checklists: newChecklists,
        assessmentProgress: {total: newChecklists.length, completed: completedChecklists}
    });
};


export default new Map([
    ["ALL_CHECKLISTS", allChecklists],
    ["COMPLETE_ASSESSMENT", completeAssessment],
    ["UPDATE_CHECKLIST_PROGRESS", updateChecklistProgress],
    ["REDUCE_CHECKLIST_PROGRESS", updateChecklistProgress],
]);

export let checklistSelectionInit = {
    checklists: [],
    assessmentProgress: {total: 0, completed: 0}
};