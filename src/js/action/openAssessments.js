import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentSyncService from "../service/AssessmentSyncService";
import SettingsService from "../service/SettingsService";
import Logger from "../framework/Logger";

const allAssessments = function (state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    const settingsService = beans.get(SettingsService);
    const assessmentMode = action.mode;
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const certifiableAssessments = assessmentService.getAllCertifiableAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return Object.assign(state, {
        certifiableAssessments: certifiableAssessments,
        openAssessments: openAssessments,
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments
    });
};

const syncAssessment = function (state, action, beans) {
    const assessmentSyncService = beans.get(AssessmentSyncService);
    assessmentSyncService.syncFacilityAssessment(action.assessment, action.cb, action.errorHandler);
    return Object.assign(state, {syncing: [action.assessment.uuid].concat(state.syncing)});
};

const assessmentSynced = function (state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    const assessmentMode = action.mode;
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return Object.assign(state, {
        syncing: state.syncing.filter((uuid) => uuid !== action.assessment.uuid),
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments
    });
};

const markAssessmentUnsubmitted = function (state, action, beans) {
    if (_.isEmpty(action.facilityAssessment.endDate) && !action.facilityAssessment.submitted) return {...state};
    const assessmentService = beans.get(FacilityAssessmentService);
    assessmentService.markUnSubmitted(action.facilityAssessment);
    const assessmentMode = action.mode;
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return Object.assign(state, {openAssessments: openAssessments, submittedAssessments: submittedAssessments});
};


export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["SYNC_ASSESSMENT", syncAssessment],
    ["COMPLETE_ASSESSMENT", allAssessments],
    ["UPDATE_CHECKPOINT", markAssessmentUnsubmitted],
    ["ASSESSMENT_SYNCED", assessmentSynced],
]);

export let openAssessmentsInit = {
    syncing: [],
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: []
};