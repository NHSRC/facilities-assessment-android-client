import _ from 'lodash';
import SettingsService from "../service/SettingsService";
import {minDate} from '../utility/DateUtils';
import SyncService from "../service/SyncService";


const initialSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.get());
};

const updateView = function (state, action, beans) {
    return Object.assign(state, {serverURL: action.serverURL});
};

const updateSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.saveSettings({serverURL: state.serverURL}));
};

const syncMetaData = function (state, action, beans) {
    const syncService = beans.get(SyncService);
    syncService.syncMetaData(action.cb);
    return Object.assign(state, {syncing: true})
};

const syncedMetaData = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.saveSettings({lastSyncedDate: new Date()}), {syncing: false});
};

export default new Map([
    ["INITIAL_SETTINGS", initialSettings],
    ["UPDATE_SETTINGS", updateSettings],
    ["UPDATE_SETTINGS_VIEW", updateView],
    ["SYNC_META_DATA", syncMetaData],
    ["SYNCED_META_DATA", syncedMetaData],
]);

export let settingsInit = {
    serverURL: "",
    lastSyncedDate: minDate,
    syncing: false,
};