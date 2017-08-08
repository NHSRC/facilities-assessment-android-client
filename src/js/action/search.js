import _ from 'lodash';
import SearchService from "../service/SearchService";

const searchFor = function (state, action, beans) {
    const searchService = beans.get(SearchService);
    let checkpoints = searchService.search(
        _.isEmpty(action.assessmentTool) ?
            action.facilityAssessment.assessmentTool : action.assessmentTool,
        action.state,
        action.searchText);
    return {...state, results: checkpoints};
};

export default new Map([
    ["SEARCH_FOR", searchFor],
]);

export let searchInit = {
    searchText: "",
    results: []
};