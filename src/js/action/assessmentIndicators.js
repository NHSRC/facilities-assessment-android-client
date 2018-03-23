import IndicatorService from "../service/IndicatorService";
import _ from 'lodash';
import Indicator from "../models/Indicator";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import Indicators from "../models/collections/Indicators";
import IndicatorDefinitions from "../models/collections/IndicatorDefinitions";
import EntityService from "../service/EntityService";
import FacilityAssessment from "../models/FacilityAssessment";
import Logger from "../framework/Logger";

const clone = function (state) {
    let cloned = {};
    cloned.assessmentUUID = state.assessmentUUID;
    cloned.indicatorDefinitions = state.indicatorDefinitions;
    cloned.indicators = [];
    cloned.indicatorDefinitionsWithError = state.indicatorDefinitionsWithError;
    cloned.outputIndicatorDefinitions = [];
    cloned.outputIndicators = [];
    cloned.resultsEvalCode = state.resultsEvalCode;
    state.indicators.forEach((indicator) => cloned.indicators.push(Object.assign(new Indicator(), indicator)));
    return cloned;
};

const allIndicators = function (state, action, beans) {
    let newState = clone(state);
    newState.indicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID, false);
    newState.outputIndicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID, false);
    newState.assessmentUUID = action.assessmentUUID;
    newState.indicators = beans.get(IndicatorService).getIndicators(action.assessmentUUID);
    newState.resultsEvalCode = IndicatorDefinitions.resultsEvalCode(newState.indicatorDefinitions, false);
    return newState;
};

const _modifyIndicator = function (state, action, beans, modifier) {
    let newState = clone(state);
    newState.indicatorDefinitionsWithError = [];
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
    let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(newState.indicatorDefinitions, newState.indicators, false, newState.resultsEvalCode, newState.assessmentUUID);
    calculatedIndicators.forEach((calculatedIndicator) => _saveIndicator(indicatorService, calculatedIndicator, newState.indicators));
    return newState;
};

const dateIndicatorChanged = function (state, action, beans) {
    return _modifyIndicator(state, action, beans, (indicator, action) => {
        indicator.dateValue = action.value;
        return true;
    });
};

const calculateIndicators = function (state, action, beans) {
    let newState = clone(state);
    let indicatorDefinitionsWithError = Indicators.indicatorDefinitionsWithErrors(newState.indicators, newState.indicatorDefinitions);
    if (_.isEmpty(indicatorDefinitionsWithError)) {
        let facilityAssessment = beans.get(EntityService).findByUUID(newState.assessmentUUID, FacilityAssessment.schema.name);
        newState.outputIndicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(facilityAssessment.assessmentTool, true);
        let resultsEvalCode = IndicatorDefinitions.resultsEvalCode(newState.outputIndicatorDefinitions, true);
        newState.outputIndicators = Indicators.evalCalculatedIndicatorValues(newState.indicatorDefinitions.concat(newState.outputIndicatorDefinitions), newState.indicators, true, resultsEvalCode, newState.assessmentUUID);
        newState.indicatorDefinitionsWithError = Indicators.indicatorDefinitionsWithPercentageError(newState.outputIndicators, newState.outputIndicatorDefinitions);
    } else {
        newState.indicatorDefinitionsWithError = indicatorDefinitionsWithError;
    }
    return newState;
};

const completedIndicatorAssessment = function (state, action, beans) {
    let indicatorService = beans.get(IndicatorService);
    indicatorService.saveAllOutputIndicators(state.outputIndicators, action.facilityAssessment);

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
    ["CALCULATE_INDICATORS", calculateIndicators],
    ["COMPLETED_INDICATOR_ASSESSMENT", completedIndicatorAssessment]
]);

export let assessmentIndicatorsInit = {
    assessmentUUID: undefined,
    indicatorDefinitions: [],
    indicators: [],
    outputIndicatorDefinitions: [],
    outputIndicators: [],
    resultsEvalCode: '',
    indicatorDefinitionsWithError: []
};