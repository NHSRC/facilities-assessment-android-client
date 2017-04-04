import _ from 'lodash';
import SearchService from "../service/SearchService";
import ChecklistService from "../service/ChecklistService";

const searchFor = function (state, action, beans) {
    const searchService = beans.get(SearchService);
    const checklistService = beans.get(ChecklistService);

    const searchText = action.searchText;
    const areasOfConcern = searchService.searchAreasOfConcern(searchText);

    const standards = searchService.searchStandards(searchText)
        .map((std) => Object.assign(std, {areaOfConcern: checklistService.getAreaConcernForStandard(action.checklist.uuid, std.uuid)}))
        .filter((std) => !_.isEmpty(std.areaOfConcern));

    const measurableElements = [];
    return Object.assign(state, {
        searchText: searchText,
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