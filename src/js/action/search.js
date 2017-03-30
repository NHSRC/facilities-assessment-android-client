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
    // searchService.searchMeasurableElements(action.searchText)
    // .map((me) => Object.assign(me, {
    //     standard: checklistService.getStandardForMeasurableElement(action.checklist.uuid, me.uuid)
    // }))
    // .filter((me) => !_.isEmpty(me.standard))
    // .map((me) => Object.assign(me, {
    //     standard: {
    //         ...me.standard,
    //         areasOfConcern: checklistService.getAreaConcernForStandard(action.checklist.uuid, me.standard.uuid)
    //     }
    // }))
    // .filter((me) => !_.isEmpty(me.standard.areasOfConcern));
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