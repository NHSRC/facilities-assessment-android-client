import SettingsService from "../service/SettingsService";
import {minDate} from '../utility/DateUtils';
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import SeedDataService from "../service/SeedDataService";
import Logger from "../framework/Logger";

const initialSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.get(), {serverURL: settingsService.getServerURL()});
};

const syncMetaData = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncAllMetaData(action.cb);
    return Object.assign(state, {syncing: true})
};

const downloadMyAssessments = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMyTxData(action.cb);
    return Object.assign(state, {syncing: true})
};

const downloadAssessment = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncAssessment(state.assessmentId, () => {});
    return Object.assign(state, {syncing: true})
};

const syncAllData = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncAllData(action.cb);
    return Object.assign(state, {syncing: true})
};

const syncedData = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.saveSettings({lastSyncedDate: new Date()}), {syncing: false});
};

const cleanData = function (state, action, beans) {
    const seedDataService = beans.get(SeedDataService);
    seedDataService.deleteAllData();
    return Object.assign(state, {});
};

const cleanTxData = function (state, action, beans) {
    const seedDataService = beans.get(SeedDataService);
    seedDataService.deleteTxData();
    return Object.assign(state, {});
};

const setAssessmentId = function (state, action) {
    let newState = Object.assign(state, {});
    newState.assessmentId = action.assessmentId;
    return newState;
};

export default new Map([
    ["INITIAL_SETTINGS", initialSettings],
    ["SYNC_META_DATA", syncMetaData],
    ["SYNC_ALL_DATA", syncAllData],
    ["DOWNLOAD_MY_ASSESSMENTS", downloadMyAssessments],
    ["DOWNLOAD_ASSESSMENT", downloadAssessment],
    ["SET_ASSESSMENT_ID", setAssessmentId],
    ["SYNCED_DATA", syncedData],
    ['CLEAN_DATA', cleanData],
    ['CLEAN_TXDATA', cleanTxData]
]);

export let settingsInit = {
    serverURL: "",
    lastSyncedDate: minDate,
    syncing: false
};