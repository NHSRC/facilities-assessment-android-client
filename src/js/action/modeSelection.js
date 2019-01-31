import ChecklistService from "../service/ChecklistService";
import SettingsService from "../service/SettingsService";
import StateService from "../service/StateService";
import SeedProgressService from "../service/SeedProgressService";

const modeSelection = function (state, action, beans) {
    const assessmentModes = beans.get(ChecklistService).assessmentModes;
    let seedProgress = beans.get(SeedProgressService).getSeedProgress();
    return {modes: assessmentModes, statesAvailableToBeLoaded: seedProgress.numberOfStates < beans.get(StateService).getAllStates().length};
};

export default new Map([
    ["MODE_SELECTION", modeSelection]
]);

export let modeSelectionInit = {
    modes: [],
    statesAvailableToBeLoaded: undefined
};