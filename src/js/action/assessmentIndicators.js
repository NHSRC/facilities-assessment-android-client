import IndicatorService from "../service/IndicatorService";
import _ from 'lodash';
import Logger from "../framework/Logger";
import Indicator from "../models/Indicator";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import Indicators from "../models/collections/Indicators";
import IndicatorDefinitions from "../models/collections/IndicatorDefinitions";

const clone = function (state) {
    let cloned = {};
    cloned.assessmentUUID = state.assessmentUUID;
    cloned.indicatorDefinitions = state.indicatorDefinitions;
    cloned.indicators = [];
    cloned.resultsEvalCode = state.resultsEvalCode;
    state.indicators.forEach((indicator) => cloned.indicators.push(Object.assign(new Indicator(), indicator)));
    return cloned;
};

const allIndicators = function (state, action, beans) {
    let newState = clone(state);
    newState.indicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID);
    newState.assessmentUUID = action.assessmentUUID;
    newState.indicators = beans.get(IndicatorService).getIndicators(action.assessmentUUID);
    newState.resultsEvalCode = IndicatorDefinitions.resultsEvalCode(newState.indicatorDefinitions);
    return newState;
};

const _modifyIndicator = function (state, action, beans, modifier) {
    let newState = clone(state);
    let indicatorService = beans.get(IndicatorService);
    let indicator = indicatorService.getIndicator(action.indicatorDefinitionUUID, newState.assessmentUUID);
    if (modifier(indicator, action)) {
        _saveIndicator(indicatorService, indicator, newState.indicators);
    }
    return newState;
};

const _saveIndicator = function (indicatorService, indicator, indicators) {
    let savedIndicator = indicatorService.saveIndicator(indicator);
    _.remove(indicators, (indicator) => indicator.indicatorDefinition === savedIndicator.indicatorDefinition);
    indicators.push(savedIndicator);
};

const codedIndicatorUpdated = function (state, action, beans) {
    return _modifyIndicator(state, action, beans, (indicator, action) => {
        indicator.codedValue = _.isNil(indicator.codedValue) ?
            action.assumedValue
            :
            indicator.codedValue === action.assumedValue ? null : action.assumedValue;
        return true;
    });
};

const numericIndicatorChanged = function (state, action, beans) {
    let newState = _modifyIndicator(state, action, beans, (indicator, action) => {
        let number = _.toNumber(action.value);
        if (!_.isNaN(number))
            indicator.numericValue = number;
        return !_.isNaN(number);
    });

    let indicatorService = beans.get(IndicatorService);
    let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(newState.indicatorDefinitions, newState.indicators, newState.resultsEvalCode, newState.assessmentUUID);
    calculatedIndicators.forEach((calculatedIndicator) => _saveIndicator(indicatorService, calculatedIndicator, newState.indicators));
    return newState;
};

const dateIndicatorChanged = function (state, action, beans) {
    return _modifyIndicator(state, action, beans, (indicator, action) => {
        indicator.dateValue = action.value;
        return true;
    });
};

const completedIndicatorAssessment = function (state, action, beans) {
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    facilityAssessmentService.markUnSubmitted(action.facilityAssessment);
    facilityAssessmentService.endAssessment(action.facilityAssessment);
    return state;
};

export default new Map([
    ["ALL_INDICATORS", allIndicators],
    ["CODED_INDICATOR_UPDATED", codedIndicatorUpdated],
    ["NUMERIC_INDICATOR_CHANGED", numericIndicatorChanged],
    ["DATE_INDICATOR_CHANGED", dateIndicatorChanged],
    ["COMPLETED_INDICATOR_ASSESSMENT", completedIndicatorAssessment]
]);

export let assessmentIndicatorsInit = {
    assessmentUUID: undefined,
    indicatorDefinitions: [],
    indicators: [],
    resultsEvalCode: ''
};