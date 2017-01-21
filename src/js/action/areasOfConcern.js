import ChecklistService from "../service/ChecklistService";

const allAreasOfConcern = function (state, action, beans) {
    const areasOfConcern = beans.get(ChecklistService).getAreasOfConcernsFor(action.checklist.uuid);
    return Object.assign(state, {"areasOfConcern": areasOfConcern});
};

export default new Map([
    ["ALL_AREAS_OF_CONCERN", allAreasOfConcern],
]);

export let areasOfConcernInit = {
    areasOfConcern: []
};