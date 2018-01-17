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

const syncMetaDataInStateMode = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.simulateSyncAllMetaData(action.cb);
    return Object.assign(state, {syncing: true});
};

const downloadMyAssessments = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMyTxData(action.cb);
    return Object.assign(state, {syncing: true})
};

const syncAllData = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    Logger.logDebug('settings', referenceDataSyncService);
    Logger.logDebugObject('settings', referenceDataSyncService);
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

export default new Map([
    ["INITIAL_SETTINGS", initialSettings],
    ["SYNC_META_DATA", syncMetaData],
    ["SYNC_META_DATA_IN_STATE_MODE", syncMetaDataInStateMode],
    ["SYNC_ALL_DATA", syncAllData],
    ["DOWNLOAD_MY_ASSESSMENTS", downloadMyAssessments],
    ["SYNCED_DATA", syncedData],
    ['CLEAN_DATA', cleanData],
    ['CLEAN_TXDATA', cleanTxData]
]);

export let settingsInit = {
    serverURL: "",
    lastSyncedDate: minDate,
    syncing: false
};