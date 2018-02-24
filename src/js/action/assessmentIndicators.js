import IndicatorService from "../service/IndicatorService";

const clone = function (state) {
    return Object.assign(state, {});
};

const allDefinitions = function (state, action, beans) {
    let newState = clone(state);
    newState.indicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentTool.uuid);
    return newState;
};

export default new Map([
    ["ALL_DEFINITIONS", allDefinitions]
]);

export let assessmentIndicatorsInit = {
    indicatorDefinitions: [],
    indicators: []
};