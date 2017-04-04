import _ from 'lodash';
import SearchService from "../service/SearchService";
import ChecklistService from "../service/ChecklistService";

const searchFor = function (state, action, beans) {
    const searchService = beans.get(SearchService);
    const checklistService = beans.get(ChecklistService);

    const areasOfConcern = searchService.searchAreasOfConcern(action.searchText);

    const standards = searchService.searchStandards(action.searchText)
        .map((std) => Object.assign(std, {areaOfConcern: checklistService.getAreaConcernForStandard(action.checklist.uuid, std.uuid)}))
        .filter((std) => !_.isEmpty(std.areaOfConcern));

    const measurableElements = [];
    return Object.assign(state, {
        searchText: action.searchText,
        results: {
            AreasOfConcern: areasOfConcern,
            Standards: standards,
            MeasurableElements: measurableElements
        }
    });
};

export default new Map([
    ["SEARCH_FOR", searchFor],
]);

export let searchInit = {
    searchText: "",
    results: {AreasOfConcern: [], Standards: [], MeasurableElements: []}
};