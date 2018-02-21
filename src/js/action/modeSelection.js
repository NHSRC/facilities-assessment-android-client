import ChecklistService from "../service/ChecklistService";
import SettingsService from "../service/SettingsService";
import StateService from "../service/StateService";

const modeSelection = function (state, action, beans) {
    const assessmentModes = beans.get(ChecklistService).assessmentModes;
    return {modes: assessmentModes, statesAvailableToBeLoaded: beans.get(SettingsService).get().states.length < beans.get(StateService).getAllStates().length};
};

export default new Map([
    ["MODE_SELECTION", modeSelection]
]);

export let modeSelectionInit = {
    modes: [],
    statesAvailableToBeLoaded: undefined
};