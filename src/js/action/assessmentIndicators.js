import IndicatorService from "../service/IndicatorService";
import _ from 'lodash';
import Logger from "../framework/Logger";
import Indicator from "../models/Indicator";
import FacilityAssessmentService from "../service/FacilityAssessmentService";

const clone = function (state) {
    let cloned = {};
    cloned.assessmentUUID = state.assessmentUUID;
    cloned.indicatorDefinitions = state.indicatorDefinitions;
    cloned.indicators = [];
    state.indicators.forEach((indicator) => cloned.indicators.push(Object.assign(new Indicator(), indicator)));
    return cloned;
};

const allDefinitions = function (state, action, beans) {
    let newState = clone(state);
    newState.indicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID);
    newState.assessmentUUID = action.assessmentUUID;
    return newState;
};

const _modifyIndicator = function (state, action, beans, modifier) {
    let newState = clone(state);
    let indicatorService = beans.get(IndicatorService);
    let indicator = indicatorService.getIndicator(action.indicatorDefinitionUUID, newState.assessmentUUID);
    if (modifier(indicator, action)) {
        let savedIndicator = indicatorService.saveIndicator(indicator);
        _.remove(newState.indicators, (indicator) => indicator.indicatorDefinition === savedIndicator.indicatorDefinition);
        newState.indicators.push(savedIndicator);
    }
    return newState;
};

const boolIndicatorToggled = function (state, action, beans) {
    return _modifyIndicator(state, action, beans, (indicator, action) => {
        indicator.boolValue = _.isNil(indicator.boolValue) ? action.assumedValue : indicator.boolValue === action.assumedValue ? null : action.assumedValue;
        return true;
    });
};

const numericIndicatorChanged = function (state, action, beans) {
    return _modifyIndicator(state, action, beans, (indicator, action) => {
        let number = _.toNumber(action.value);
        if (!_.isNaN(number))
            indicator.numericValue = number;
        return !_.isNaN(number);
    });
};

const dateIndicatorChanged = function (state, action, beans) {
    return _modifyIndicator(state, action, beans, (indicator, action) => {
        indicator.dateValue = action.value;
        return true;
    });
};

const completedIndicatorChanged = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    const endAssessment = facilityAssessmentService.endAssessment(action.facilityAssessment);
    return state;
};

export default new Map([
    ["ALL_DEFINITIONS", allDefinitions],
    ["BOOL_INDICATOR_TOGGLED", boolIndicatorToggled],
    ["NUMERIC_INDICATOR_CHANGED", numericIndicatorChanged],
    ["DATE_INDICATOR_CHANGED", dateIndicatorChanged],
    ["COMPLETED_INDICATOR_ASSESSMENT", completedIndicatorChanged]
]);

export let assessmentIndicatorsInit = {
    assessmentUUID: undefined,
    indicatorDefinitions: [],
    indicators: []
};