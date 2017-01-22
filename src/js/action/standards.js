import ChecklistService from "../service/ChecklistService";

const allStandards = function (state, action, beans) {
    const standards = beans.get(ChecklistService).getStandardsFor(action.checklist.uuid, action.areaOfConcern.uuid);
    return Object.assign(state, {"standards": standards});
};

export default new Map([
    ["ALL_STANDARDS", allStandards],
]);

export let standardsInit = {
    standards: []
};