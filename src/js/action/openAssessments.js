import _ from 'lodash';
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentSyncService from "../service/AssessmentSyncService";
import SettingsService from "../service/SettingsService";
import FacilityAssessment from "../models/FacilityAssessment";
import EntityService from "../service/EntityService";
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

const startSubmitAssessment = function (state, action) {
    let submissionDetailAvailable = FacilityAssessment.submissionDetailsAvailable(action.facilityAssessment, action.facilityAssessment.assessmentTool);
    return Object.assign(state, {
        submittingAssessment: action.facilityAssessment,
        submissionDetailAvailable: submissionDetailAvailable,
        assessmentToolType: action.facilityAssessment.assessmentTool.assessmentToolType
    });
};

const submissionCancelled = function (state, action, beans) {
    return Object.assign(state, {submittingAssessment: undefined});
};

const syncAssessment = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'syncAssessment');
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    facilityAssessmentService.saveSubmissionDetails(state.submittingAssessment);

    const assessmentSyncService = beans.get(AssessmentSyncService);
    assessmentSyncService.syncFacilityAssessment(action.facilityAssessment, action.cb, action.errorHandler);
    return Object.assign(state, {syncing: [action.facilityAssessment.uuid].concat(state.syncing)});
};

const assessmentSynced = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'assessmentSynced');
    const assessmentService = beans.get(FacilityAssessmentService);
    const assessmentMode = action.mode;
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return Object.assign(state, {
        syncing: state.syncing.filter((uuid) => uuid !== action.facilityAssessment.uuid),
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments,
        submittingAssessment: undefined
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

const _updateSubmittingAssessment = function (state, updateObject) {
    let newState = {submittingAssessment: Object.assign({}, state.submittingAssessment, updateObject)};
    newState.submissionDetailAvailable = FacilityAssessment.submissionDetailsAvailable(newState.submittingAssessment, newState.submittingAssessment.assessmentTool);
    return Object.assign({}, state, newState);
};

const enterAssessorName = function (state, action, beans) {
    return _updateSubmittingAssessment(state, {assessorName: action.assessorName});
};

const enterSeries = function (state, action, beans) {
    if (isNaN(action.series)) return state;
    return _updateSubmittingAssessment(state, {seriesName: action.series});
};

const generateAssessmentSeries = function (state, action, beans) {
    return _updateSubmittingAssessment(state, {seriesName: FacilityAssessment.generateSeries()});
};

export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["SYNC_ASSESSMENT", syncAssessment],
    ["START_SUBMIT_ASSESSMENT", startSubmitAssessment],
    ["COMPLETE_ASSESSMENT", allAssessments],
    ["UPDATE_CHECKPOINT", markAssessmentUnsubmitted],
    ["ASSESSMENT_SYNCED", assessmentSynced],
    ["ENTER_ASSESSOR_NAME", enterAssessorName],
    ["ENTER_ASSESSMENT_SERIES", enterSeries],
    ["GENERATE_ASSESSMENT_SERIES", generateAssessmentSeries],
    ["SUBMISSION_CANCELLED", submissionCancelled]
]);

export let openAssessmentsInit = {
    syncing: [],
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
    submittingAssessment: undefined
};