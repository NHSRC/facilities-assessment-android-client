import _ from 'lodash';
import SettingsService from "../service/SettingsService";
import {minDate} from '../utility/DateUtils';


const initialSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.get());
};

const updateView = function (state, action, beans) {
    return Object.assign(state, {serverURL: action.serverURL});
};

const updateSettings = function (state, action, beans) {
    const settingsService = beans.get(SettingsService);
    return Object.assign(state, settingsService.saveSettings({uuid: state.uuid, serverURL: state.serverURL}));
};

export default new Map([
    ["INITIAL_SETTINGS", initialSettings],
    ["UPDATE_SETTINGS", updateSettings],
    ["UPDATE_SETTINGS_VIEW", updateView],
]);

export let settingsInit = {
    serverURL: "",
    lastSyncedDate: minDate,
};