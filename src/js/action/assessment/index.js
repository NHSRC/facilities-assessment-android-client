import ChecklistService from "../../service/ChecklistService";
import _ from 'lodash';

const initialData = function (state, actionParams, beans) {
    const checklistService = beans.get(ChecklistService);
    var checklist = checklistService.getChecklist(actionParams.checklist.uuid);
    checklist.areasOfConcern[0].visible = true;
    return Object.assign(state, {
        checklist: checklist
    });
};

const expandAreaOfConcern = function (state, actionParams, beans) {
    var newState = _.merge({}, state);
    newState.checklist.areasOfConcern = newState.checklist.areasOfConcern
        .map((aoc)=> {
            if (actionParams.expandAoc.uuid === aoc.uuid) {
                aoc.visible = !aoc.visible;
            } else {
                aoc.visible = false;
            }
            return aoc;
        });
    return newState;
};


export default new Map([
    ["INITIAL_DATA", initialData],
    ["EXPAND_AREA_OF_CONCERN", expandAreaOfConcern]
]);

export let assessmentInit = {
    checklist: {areasOfConcern: [], name: ""},
};