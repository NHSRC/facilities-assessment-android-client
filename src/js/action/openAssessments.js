import _ from 'lodash';
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import SettingsService from "../service/SettingsService";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import Logger from "../framework/Logger";
import FacilityAssessment from "../models/FacilityAssessment";

const _getAssessmentMode = function (action, state) {
    return _.isNil(action.mode) ? state.mode : action.mode;
};

const allAssessments = function (state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    const settingsService = beans.get(SettingsService);

    const assessmentMode = _getAssessmentMode(action, state);
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const certifiableAssessments = EnvironmentConfig.isEmulated ? completedAssessments : assessmentService.getAllCertifiableAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);

    return _.assignIn(state, {
        certifiableAssessments: certifiableAssessments,
        openAssessments: openAssessments,
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments,
        mode: assessmentMode
    });
};

const launchSubmitAssessment = function (state, action, beans) {
    let assessmentService = beans.get(FacilityAssessmentService);
    let assessment = assessmentService.getAssessment(action.facilityAssessment.uuid);
    return _.assignIn(state, {
        chosenAssessment: assessment,
        submittingAssessment: true
    });
};

const assessmentSaved = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'assessmentSynced');
    const assessmentService = beans.get(FacilityAssessmentService);
    const assessmentMode = _getAssessmentMode(action, state);
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return _.assignIn(state, {
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments,
        syncing: state.syncing.filter((uuid) => uuid !== state.chosenAssessment.uuid),
        chosenAssessment: undefined,
        submittingAssessment: false
    });
};

const assessmentSyncing = function (state, action, beans) {
    if (_.isNil(state.chosenAssessment)) return state;
    return _.assignIn(state, {syncing: [state.chosenAssessment.uuid].concat(state.syncing)});
};

const getAssessmentSummary = function(state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    assessmentService.getAssessmentSummary(action.facilityAssessment.syncedUuid, action.cb, action.errorHandler);
    return _.assignIn(state, {loadingData: true, chosenAssessment: action.facilityAssessment});
};

const assessmentSummaryLoaded = function(state, action, beans) {
    return _.assignIn(state, {assessmentSummary: action.assessmentSummary, loadingData: false});
};

const assessmentSummaryLoadFailed = function(state, action, beans) {
    return _.assignIn(state, {loadingData: false, chosenAssessment: undefined});
};

const assessmentSummaryClosed = function(state, action, beans) {
    return _.assignIn(state, {chosenAssessment: undefined, assessmentSummary: undefined});
};

const submissionCancelled = function (state) {
    return _.assignIn(state, {chosenAssessment: undefined, submittingAssessment: false});
};

export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["ASSESSMENT_SYNCED", assessmentSaved],
    ["COMPLETE_ASSESSMENT", allAssessments],
    ["LAUNCH_SUBMIT_ASSESSMENT", launchSubmitAssessment],
    ["SYNC_ASSESSMENT", assessmentSyncing],
    ["GET_ASSESSMENT_SUMMARY", getAssessmentSummary],
    ["ASSESSMENT_SUMMARY_LOADED", assessmentSummaryLoaded],
    ["ASSESSMENT_SUMMARY_LOAD_FAILED", assessmentSummaryLoadFailed],
    ["ASSESSMENT_SUMMARY_CLOSED", assessmentSummaryClosed],
    ["SUBMISSION_CANCELLED", submissionCancelled]
]);

export let openAssessmentsInit = {
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
    chosenAssessment: undefined,
    syncing: [],
    mode: undefined,
    loadingData: false,
    assessmentSummary: undefined,
    submittingAssessment: false
};
