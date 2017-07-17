import _ from 'lodash';
import SearchService from "../service/SearchService";
import ChecklistService from "../service/ChecklistService";

const searchFor = function (state, action, beans) {
    return state;
};

export default new Map([
    ["SEARCH_FOR", searchFor],
]);

export let searchInit = {
    searchText: "",
    results: {AreasOfConcern: [], Standards: [], MeasurableElements: []}
};