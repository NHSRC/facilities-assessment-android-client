import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import AssessmentService from "../service/AssessmentService";

const allAreasOfConcern = function (state, action, beans) {
    const areasOfConcern = beans.get(ChecklistService).getAreasOfConcernsFor(action.checklist.uuid);
    const assessmentService = beans.get(AssessmentService);
    let aocProgress = areasOfConcern.map((aoc) =>
        assessmentService.getAreaOfConcernProgress(aoc, action.checklist, action.facilityAssessment));
    return Object.assign(state, {"areasOfConcern": _.zipWith(areasOfConcern, aocProgress, Object.assign)});
};

export default new Map([
    ["ALL_AREAS_OF_CONCERN", allAreasOfConcern],
    ["UPDATE_PROGRESS", allAreasOfConcern],
]);

export let areasOfConcernInit = {
    areasOfConcern: []
};