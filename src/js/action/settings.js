import SettingsService from "../service/SettingsService";
import {minDate} from '../utility/DateUtils';
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import SeedDataService from "../service/SeedDataService";
import Logger from "../framework/Logger";
import BatchRequest from "../framework/http/BatchRequest";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

const initialSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.get(), {serverURL: settingsService.getServerURL()});
};

const downloadMyAssessments = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMyTxData(action.cb);
    return Object.assign(state, {syncing: true})
};

const downloadAssessment = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncAssessment(state.assessmentId, () => {
    });
    return Object.assign(state, {syncing: true})
};

const syncedData = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.saveSettings({lastSyncedDate: new Date()}), {syncing: false});
};

const setAssessmentId = function (state, action) {
    let newState = Object.assign(state, {});
    newState.assessmentId = action.assessmentId;
    return newState;
};

const simulateServerError = function (state, action) {
    const batchRequest = new BatchRequest();
    batchRequest.post(`${EnvironmentConfig.serverURL}/api/error/throw`, {}, (response) => {
            Logger.logDebug('settings', "No error");
            Logger.logDebug('settings', response);
            action.noError();
        },
        (error) => {
            Logger.logError('settings', JSON.stringify(error));
            action.error(error);
        });
    batchRequest.fire(() => {}, () => {});
    return state;
};

export default new Map([
    ["INITIAL_SETTINGS", initialSettings],
    ["DOWNLOAD_MY_ASSESSMENTS", downloadMyAssessments],
    ["DOWNLOAD_ASSESSMENT", downloadAssessment],
    ["SET_ASSESSMENT_ID", setAssessmentId],
    ["SYNCED_DATA", syncedData],
    ["SIMULATE_SERVER_ERROR", simulateServerError]
]);

export let settingsInit = {
    serverURL: "",
    lastSyncedDate: minDate,
    syncing: false
};