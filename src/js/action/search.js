import _ from 'lodash';
import SearchService from "../service/SearchService";

const searchFor = function (state, action, beans) {
    const searchService = beans.get(SearchService);
    let checkpoints = searchService.search(action.facilityAssessment.assessmentTool,
        action.facilityAssessment.state,
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