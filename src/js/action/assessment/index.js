import ChecklistService from "../../service/ChecklistService";
import _ from 'lodash';

const initialData = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    var checklist = checklistService.getChecklist(actionParams.checklist.uuid);
    return Object.assign(state, {
        checklist: checklist
    });
};

export default new Map([
    ["INITIAL_DATA", initialData],
]);

export let assessmentInit = {
    checklist: {areasOfConcern: [], name: ""},
};