import ChecklistService from "../../service/ChecklistService";

const allChecklists = function (state, action, beans) {
    const checklists = beans.get(ChecklistService).getChecklistsFor(action.assessmentTool);
    return Object.assign(state, {"checklists": checklists});
};

export default new Map([
    ["ALL_CHECKLISTS", allChecklists]
]);

export let checklistSelectionInit = {
    checklists: []
};