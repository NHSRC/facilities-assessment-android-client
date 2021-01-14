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
    let assessment = FacilityAssessment.clone(action.facilityAssessment);
    return _.assignIn(state, {
        submittingAssessment: assessment
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
        syncing: state.syncing.filter((uuid) => uuid !== state.submittingAssessment.uuid),
        submittingAssessment: undefined
    });
};

const assessmentSyncing = function (state, action, beans) {
    if (_.isNil(state.submittingAssessment)) return state;
    return _.assignIn(state, {syncing: [state.submittingAssessment.uuid].concat(state.syncing)});
};

export default new Map([
    ["ALL_ASSESSMENTS", allAssessments],
    ["ASSESSMENT_SYNCED", assessmentSaved],
    ["COMPLETE_ASSESSMENT", allAssessments],
    ["LAUNCH_SUBMIT_ASSESSMENT", launchSubmitAssessment],
    ["SYNC_ASSESSMENT", assessmentSyncing]
]);

export let openAssessmentsInit = {
    openAssessments: [],
    completedAssessments: [],
    submittedAssessments: [],
    submittingAssessment: undefined,
    syncing: [],
    mode: undefined
};