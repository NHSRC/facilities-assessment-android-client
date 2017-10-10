import ChecklistService from "../service/ChecklistService";

const modeSelection = function (state, action, beans) {
    const assessmentModes = beans.get(ChecklistService).assessmentModes;
    return {modes: assessmentModes};
};

export default new Map([
    ["MODE_SELECTION", modeSelection]
]);

export let modeSelectionInit = {
    modes: []
};