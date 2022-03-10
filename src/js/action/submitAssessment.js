import FacilityAssessment from "../models/FacilityAssessment";
import Logger from "../framework/Logger";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentSyncService from "../service/AssessmentSyncService";
import AssessmentMetaDataService from "../service/metadata/AssessmentMetaDataService";
import _ from 'lodash';
import AssessmentMetaData from "../models/assessment/AssessmentMetaData";
import EntityService from "../service/EntityService";
import AuthService from "../service/AuthService";

export const LoginStatus = {
    UNKNOWN: 1,
    LOGGED_IN: 2,
    NOT_LOGGED_IN: 3,
    LOGIN_NOT_REQUIRED: 4,
    DO_NOT_ASK: 5,
    TRYING_LOGIN: 6
};

const _areSubmissionDetailsAvailable = function (assessment, beans, protectedAssessment) {
    let assessmentMetaDataService = beans.get(AssessmentMetaDataService);
    let assessmentMetaDataListToCheck = protectedAssessment ? [] : assessmentMetaDataService.getAll();
    let seriesNameCheckPassed = FacilityAssessment.seriesNameCheckPassed(assessment.assessmentTool, assessment);
    return _.reduce(assessmentMetaDataListToCheck,
        (available, assessmentMetaData) => FacilityAssessment.fieldChecksPassed(assessmentMetaData, assessment) && available,
        seriesNameCheckPassed);
};

const updateLoginStatus = function (state, action, context) {
    return _.assignIn(state, {
        loginStatus: action.loginStatus,
        errorMessage: action.errorMessage,
        assessmentNumbers: action.assessmentNumbers
    });
}

const isSubmissionProtected = function (state, action, beans) {
    const faService = beans.get(FacilityAssessmentService);
    let assessment = faService.getAssessment(action.facilityAssessment.uuid);
    faService.isSubmissionProtected(assessment, action.setSubmissionProtectionStatus, action.launchSubmissionError);
    return _.assignIn(state, {
        submissionProtectionStatusKnown: false
    });
}

const startSubmitAssessment = function (state, action, beans) {
    const entityService = beans.get(EntityService);
    const assessmentService = beans.get(FacilityAssessmentService);

    let assessment = assessmentService.getAssessment(action.facilityAssessment.uuid);
    let submissionDetailAvailable = _areSubmissionDetailsAvailable(assessment, beans, action.isSubmissionProtected);
    const assessmentMetaDataList = entityService.findAll(AssessmentMetaData);
    let newState = _.assignIn(state, {
        protectedAssessment: action.isSubmissionProtected,
        submissionProtectionStatusKnown: true,
        errorMessage: null,
        chosenAssessment: assessment,
        submissionDetailAvailable: submissionDetailAvailable,
        assessmentToolType: assessment.assessmentTool.assessmentToolType,
        assessmentMetaDataList: assessmentMetaDataList,
        assessmentNumbers: []
    });
    if (newState.protectedAssessment && action.loginStatus !== LoginStatus.LOGGED_IN) {
        beans.get(AuthService).verifySession().then(() => _getAssessmentNumbers(beans, state)).then(action.loggedIn).catch(() => action.notLoggedIn());
    } else {
        newState.loginStatus = LoginStatus.LOGIN_NOT_REQUIRED;
    }

    return newState;
};

const _getAssessmentNumbers = function (beans, state) {
    const faService = beans.get(FacilityAssessmentService);
    return faService.getAssessmentNumbers(state.chosenAssessment);
};

const submissionCancelled = function (state, action, beans) {
    return _.assignIn(state, {chosenAssessment: undefined, loginStatus: LoginStatus.DO_NOT_ASK});
};

const syncAssessment = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'syncAssessment');
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    facilityAssessmentService.saveSubmissionDetails(state.chosenAssessment);

    const assessmentSyncService = beans.get(AssessmentSyncService);
    assessmentSyncService.syncFacilityAssessment(state.chosenAssessment, action.cb, action.errorHandler);
    return state;
};

const markAssessmentUnsubmitted = function (state, action, beans) {
    if (_.isNil(action.facilityAssessment.endDate) && !action.facilityAssessment.submitted) return {...state};
    const assessmentService = beans.get(FacilityAssessmentService);
    let assessment = assessmentService.markUnSubmitted(action.facilityAssessment);
    const assessmentMode = action.mode;
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return _.assignIn(state, {openAssessments: openAssessments, submittedAssessments: submittedAssessments, chosenAssessment: assessment});
};

const _updateSubmittingAssessment = function (state, updateObject, beans) {
    let stateChanges = {chosenAssessment: _.assignIn({}, state.chosenAssessment, updateObject)};
    stateChanges.submissionDetailAvailable = _areSubmissionDetailsAvailable(stateChanges.chosenAssessment, beans, state.protectedAssessment);
    return _.assignIn({}, state, stateChanges);
};

const enterCustomInfo = function (state, action, beans) {
    let newSubmittingAssessment = FacilityAssessment.clone(state.chosenAssessment);
    FacilityAssessment.updateCustomInfo(action.assessmentMetaData, action.valueString, newSubmittingAssessment);
    let stateChanges = {chosenAssessment: newSubmittingAssessment};
    stateChanges.submissionDetailAvailable = _areSubmissionDetailsAvailable(stateChanges.chosenAssessment, beans, state.protectedAssessment);
    return _.assignIn({}, state, stateChanges);
};

const enterSeries = function (state, action, beans) {
    return _updateSubmittingAssessment(state, {seriesName: action.series}, beans);
};

const generateAssessmentSeries = function (state, action, beans) {
    return _updateSubmittingAssessment(state, {seriesName: FacilityAssessment.generateSeries()}, beans);
};

const assessmentSynced = function (state, action, beans) {
    return _.assignIn(state, {
        chosenAssessment: undefined
    });
};

const login = function (state, action, beans) {
    beans.get(AuthService).login(state.email, state.password).then(() => _getAssessmentNumbers(beans, state)).then(action.successfulLogin).catch((error) => {
        Logger.logError("submitAssessment", error.message);
        action.loginFailed(error.message);
    });
    return _.assignIn(state, {
        loginStatus: LoginStatus.TRYING_LOGIN,
        errorMessage: null
    });
};

const changeLoginDetails = function (state, action, beans) {
    return _.assignIn(state, action);
};

export default new Map([
        ["SYNC_ASSESSMENT", syncAssessment],
        ["START_SUBMIT_ASSESSMENT", startSubmitAssessment],
        ["UPDATE_CHECKPOINT", markAssessmentUnsubmitted],
        ["ASSESSMENT_SYNCED", assessmentSynced],
        ["ENTER_CUSTOM_INFO", enterCustomInfo],
        ["ENTER_ASSESSMENT_SERIES", enterSeries],
        ["GENERATE_ASSESSMENT_SERIES", generateAssessmentSeries],
        ["SUBMISSION_CANCELLED", submissionCancelled],
        ["CHANGE_LOGIN_DETAILS", changeLoginDetails],
        ["LOGIN", login],
        ["UPDATE_LOGIN_STATUS", updateLoginStatus],
        ["IS_SUBMISSION_PROTECTED", isSubmissionProtected],
    ]
);

export let submitAssessmentInit = {
    chosenAssessment: undefined,
    assessmentMetaDataList: [],
    submissionDetailAvailable: false,
    loginStatus: LoginStatus.UNKNOWN,
    email: null,
    password: null,
    errorMessage: null,
    assessmentNumbers: [],
    protectedAssessment: false,
    submissionProtectionStatusKnown: false
};
