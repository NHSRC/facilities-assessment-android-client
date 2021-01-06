import IndicatorService from "../service/IndicatorService";
import _ from 'lodash';
import Indicator from "../models/Indicator";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import Indicators from "../models/collections/Indicators";
import IndicatorDefinitions from "../models/collections/IndicatorDefinitions";
import EntityService from "../service/EntityService";
import FacilityAssessment from "../models/FacilityAssessment";

const clone = function (state) {
    let cloned = {};
    cloned.assessmentUUID = state.assessmentUUID;
    cloned.indicatorDefinitions = state.indicatorDefinitions;
    cloned.indicators = [];
    cloned.indicatorDefinitionsWithError = state.indicatorDefinitionsWithError;
    cloned.outputIndicatorDefinitions = [];
    cloned.outputIndicators = [];
    cloned.resultsEvalCode = state.resultsEvalCode;
    cloned.dateFieldInEdit = state.dateFieldInEdit;
    cloned.workflowStatus = state.workflowStatus;
    state.indicators.forEach((indicator) => cloned.indicators.push(_.assignIn(new Indicator(), indicator)));
    return cloned;
};

const allIndicators = function (state, action, beans) {
    let newState = clone(state);
    newState.indicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID, false);
    newState.outputIndicatorDefinitions = beans.get(IndicatorService).getIndicatorDefinitions(action.assessmentToolUUID, false);
    newState.assessmentUUID = action.assessmentUUID;
    newState.indicators = beans.get(IndicatorService).getIndicators(action.assessmentUUID);
    newState.resultsEvalCode = IndicatorDefinitions.resultsEvalCode(newState.indicatorDefinitions, false);
    newState.workflowStatus = IndicatorWorkflowStatus.CalculationNotDone;
    return newState;
};

const _modifyIndicator = function (state, action, beans, modifier) {
    let newState = clone(state);
    newState.indicatorDefinitionsWithError = [];
    newState.workflowStatus = IndicatorWorkflowStatus.CalculationNotDone;
    let indicatorService = beans.get(IndicatorService);
    let indicator = indicatorService.getIndicator(action.indicatorDefinitionUUID, newState.assessmentUUID);
    if (modifier(indicator, action, newState)) {
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
        indicator.codedValue = action.assumedValue;
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
    return _modifyIndicator(state, action, beans, (indicator, action, newState) => {
        indicator.dateValue = action.value;
        if (!action.editing) {
            newState.dateFieldInEdit = undefined;
        }
        return true;
    });
};

const dateIndicatorEditing = function (state, action, beans) {
    let newState = clone(state);
    newState.dateFieldInEdit = action.indicatorDefinitionUUID;
    return newState;
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
        newState.workflowStatus = IndicatorWorkflowStatus.CalculationDoneWithoutError;
    } else {
        newState.indicatorDefinitionsWithError = indicatorDefinitionsWithError;
        newState.workflowStatus = IndicatorWorkflowStatus.CalculationDoneWithError;
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
    ["DATE_INDICATOR_EDITING", dateIndicatorEditing],
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
    indicatorDefinitionsWithError: [],
    dateFieldInEdit: undefined,
    workFlowStatus: undefined
};

export const IndicatorWorkflowStatus = {CalculationNotDone: 1, CalculationDone: 2, CalculationDoneWithError: 3, CalculationDoneWithoutError: 4};
Object.freeze(IndicatorWorkflowStatus);