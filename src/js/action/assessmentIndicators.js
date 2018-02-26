import IndicatorService from "../service/IndicatorService";
import _ from 'lodash';

const clone = function (state) {
    return Object.assign(state, {});
};

const allDefinitions = function (state, action, beans) {
    let newState = clone(state);
    newState.indicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID);
    return newState;
};

const boolIndicatorToggled = function (state, action, beans) {
    let newState = clone(state);
    let indicator = beans.get(IndicatorService).getIndicator(action.indicatorDefinitionUUID, newState.assessmentUUID);
    indicator.boolValue = _.isNil(indicator.boolValue) ? action.assumedValue : indicator.boolValue === action.assumedValue ? null : action.assumedValue;
    beans.get(IndicatorService).saveIndicator(indicator);
    return newState;
};

export default new Map([
    ["ALL_DEFINITIONS", allDefinitions],
    ["BOOL_INDICATOR_TOGGLED", boolIndicatorToggled],
]);

export let assessmentIndicatorsInit = {
    assessmentUUID: undefined,
    indicatorDefinitions: [],
    indicators: []
};