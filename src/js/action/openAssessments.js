import _ from 'lodash';
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentSyncService from "../service/AssessmentSyncService";
import SettingsService from "../service/SettingsService";
import FacilityAssessment from "../models/FacilityAssessment";
import Logger from "../framework/Logger";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import EntityService from "../service/EntityService";
import AssessmentMetaData from "../models/assessment/AssessmentMetaData";
import AssessmentTool from "../models/AssessmentTool";
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import AssessmentMetaDataService from "../service/metadata/AssessmentMetaDataService";

const _areSubmissionDetailsAvailable = function (assessment, beans) {
    let assessmentMetaDataService = beans.get(AssessmentMetaDataService);
    let assessmentMetaDataList = assessmentMetaDataService.getAll();
    return _.reduce(assessmentMetaDataList,
        (available, assessmentMetaData) => FacilityAssessment.fieldChecksPassed(assessmentMetaData, assessment) && available,
        FacilityAssessment.seriesNameCheckPassed(assessment.assessmentTool, assessment));
};

const allAssessments = function (state, action, beans) {
    const assessmentService = beans.get(FacilityAssessmentService);
    const settingsService = beans.get(SettingsService);
    const entityService = beans.get(EntityService);
    const assessmentMode = action.mode;
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const certifiableAssessments = EnvironmentConfig.isEmulated ? completedAssessments : assessmentService.getAllCertifiableAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    const assessmentMetaDataList = entityService.findAll(AssessmentMetaData);
    return _.assignIn(state, {
        certifiableAssessments: certifiableAssessments,
        openAssessments: openAssessments,
        completedAssessments: completedAssessments,
        submittedAssessments: submittedAssessments,
        assessmentMetaDataList: assessmentMetaDataList
    });
};

const startSubmitAssessment = function (state, action, beans) {
    let assessment = FacilityAssessment.clone(action.facilityAssessment);
    let submissionDetailAvailable = _areSubmissionDetailsAvailable(assessment, beans);
    return _.assignIn(state, {
        submittingAssessment: assessment,
        submissionDetailAvailable: submissionDetailAvailable,
        assessmentToolType: assessment.assessmentTool.assessmentToolType
    });
};

const submissionCancelled = function (state, action, beans) {
    return _.assignIn(state, {submittingAssessment: undefined});
};

const syncAssessment = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'syncAssessment');
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    facilityAssessmentService.saveSubmissionDetails(state.submittingAssessment);

    const assessmentSyncService = beans.get(AssessmentSyncService);
    assessmentSyncService.syncFacilityAssessment(state.submittingAssessment, action.cb, action.errorHandler);
    return _.assignIn(state, {syncing: [state.submittingAssessment.uuid].concat(state.syncing)});
};

const assessmentSynced = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'assessmentSynced');
    const assessmentService = beans.get(FacilityAssessmentService);
    const assessmentMode = action.mode;
    const completedAssessments = assessmentService.getAllCompletedAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return _.assignIn(state, {
        syncing: state.syncing.filter((uuid) => uuid !== state.submittingAssessment.uuid),
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
    return _.assignIn(state, {openAssessments: openAssessments, submittedAssessments: submittedAssessments});
};

const _updateSubmittingAssessment = function (state, updateObject, beans) {
    let newState = {submittingAssessment: _.assignIn({}, state.submittingAssessment, updateObject)};
    newState.submissionDetailAvailable = _areSubmissionDetailsAvailable(newState.submittingAssessment, beans);
    return _.assignIn({}, state, newState);
};

const enterCustomInfo = function (state, action, beans) {
    let newSubmittingAssessment = FacilityAssessment.clone(state.submittingAssessment);
    FacilityAssessment.updateCustomInfo(action.assessmentMetaData, action.valueString, newSubmittingAssessment);
    let newState = {submittingAssessment: newSubmittingAssessment};
    newState.submissionDetailAvailable = _areSubmissionDetailsAvailable(newState.submittingAssessment, beans);
    return _.assignIn({}, state, newState);
};

const enterSeries = function (state, action, beans) {
    if (isNaN(action.series)) return state;
    return _updateSubmittingAssessment(state, {seriesName: action.series}, beans);
};

const generateAssessmentSeries = function (state, action, beans) {
    return _updateSubmittingAssessment(state, {seriesName: FacilityAssessment.generateSeries()}, beans);
};

export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["SYNC_ASSESSMENT", syncAssessment],
    ["START_SUBMIT_ASSESSMENT", startSubmitAssessment],
    ["COMPLETE_ASSESSMENT", allAssessments],
    ["UPDATE_CHECKPOINT", markAssessmentUnsubmitted],
    ["ASSESSMENT_SYNCED", assessmentSynced],
    ["ENTER_CUSTOM_INFO", enterCustomInfo],
    ["ENTER_ASSESSMENT_SERIES", enterSeries],
    ["GENERATE_ASSESSMENT_SERIES", generateAssessmentSeries],
    ["SUBMISSION_CANCELLED", submissionCancelled]
]);

export let openAssessmentsInit = {
    syncing: [],
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
    assessmentMetaDataList: [],
    submittingAssessment: undefined
};