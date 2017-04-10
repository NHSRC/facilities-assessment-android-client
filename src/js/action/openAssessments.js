import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import SyncService from "../service/SyncService";

const allAssessments = function (state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    const assessmentMode = action.mode;
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return Object.assign(state, {
        openAssessments: openAssessments,
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments
    });
};

const syncAssessment = function (state, action, beans) {
    const syncService = beans.get(SyncService);
    syncService.syncFacilityAssessment(action.assessment);
    return Object.assign(state, {});
};

export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["SYNC_ASSESSMENT", syncAssessment],
]);

export let openAssessmentsInit = {
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
};