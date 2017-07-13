import _ from 'lodash';
import SettingsService from "../service/SettingsService";
import {minDate} from '../utility/DateUtils';
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import SeedDataService from "../service/SeedDataService";
import Config from "react-native-config";

const initialSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.get(), {serverConnected: settingsService.hasServerURL()});
};

const updateView = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    const serverURL = _.isEmpty(action.serverURL) ? "http://" : action.serverURL;
    return Object.assign(state, settingsService.saveSettings({serverURL: serverURL}));
};

const updateSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    let newState = Object.assign(state, settingsService.saveSettings({serverURL: state.serverURL}));
    action.cb();
    return newState;
};

const syncMetaData = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMetaData(action.cb);
    return Object.assign(state, {syncing: true})
};

const syncedMetaData = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.saveSettings({lastSyncedDate: new Date()}), {syncing: false});
};

const cleanData = function (state, action, beans) {
    const seedDataService = beans.get(SeedDataService);
    seedDataService.deleteAllData();
    return Object.assign(state, {});
};

export default new Map([
    ["INITIAL_SETTINGS", initialSettings],
    ["UPDATE_SETTINGS", updateSettings],
    ["UPDATE_SETTINGS_VIEW", updateView],
    ["SYNC_META_DATA", syncMetaData],
    ["SYNCED_META_DATA", syncedMetaData],
    ['CLEAN_DATA', cleanData]
]);

export let settingsInit = {
    serverURL: Config.SERVER_URL,
    lastSyncedDate: minDate,
    syncing: false,
    serverConnected: false
};