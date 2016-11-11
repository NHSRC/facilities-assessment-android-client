import ChecklistService from "../../service/ChecklistService";

const initialData = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    const checklist = checklistService.getChecklist(actionParams.checklist.uuid);
    return Object.assign(state, {
        checklist: checklist
    });
};

const selectDepartment = function (state, actionParams, beans) {
    return Object.assign(state, {selectedDepartment: actionParams.department});
};

const id = (state)=>state;


export default new Map([
    ["INITIAL_DATA", initialData],
    ["SELECT_DEPARTMENT", selectDepartment],
    ["SELECT_AREA_OF_CONCERN", id],
    ["SELECT_STANDARD", id]
]);

export let assessmentInit = {
    checklist: {},
};