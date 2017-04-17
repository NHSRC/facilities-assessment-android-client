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
    syncService.syncFacilityAssessment(action.assessment, action.cb);
    return Object.assign(state, {syncing: [action.assessment.uuid].concat(state.syncing)});
};

const assessmentSynced = function (state, action, beans) {
    return Object.assign(state, {syncing: state.syncing.filter((uuid) => uuid !== action.assessment.uuid)});
};


export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["SYNC_ASSESSMENT", syncAssessment],
    ["ASSESSMENT_SYNCED", assessmentSynced],
]);

export let openAssessmentsInit = {
    syncing: [],
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
};