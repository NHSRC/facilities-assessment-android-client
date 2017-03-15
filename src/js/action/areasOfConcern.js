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

const updateProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    let updatedProgress = assessmentService.updateAreaOfConcernProgress(action.areaOfConcern, action.checklist, action.facilityAssessment);
    const newAOCs = state.areasOfConcern.map((aoc) => aoc.uuid === action.areaOfConcern.uuid ?
        Object.assign(aoc, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : aoc);

    return Object.assign(state, {"areasOfConcern": newAOCs});
};

export default new Map([
    ["ALL_AREAS_OF_CONCERN", allAreasOfConcern],
    ["UPDATE_PROGRESS", updateProgress],
]);

export let areasOfConcernInit = {
    areasOfConcern: []
};