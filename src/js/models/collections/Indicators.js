import IndicatorDefinitions from "./IndicatorDefinitions";
import _ from 'lodash';
import Indicator from "../Indicator";
import IndicatorDefinition from "../IndicatorDefinition";
import Logger from "../../framework/Logger";

class Indicators {
    static unfilledIndicatorDefinitions(indicators, indicatorDefinitions) {
        return _.filter(indicatorDefinitions, (indicatorDefinition) => !indicatorDefinition.output && _.isNil(Indicators.findIndicator(indicators, indicatorDefinition.uuid)));
    }

    static findIndicator(indicators, indicatorDefinitionUUID) {
        return _.find(indicators, (indicator => indicator.indicatorDefinition === indicatorDefinitionUUID));
    };

    static evalCalculatedIndicatorValues(indicatorDefinitions, indicators, isOutput, resultsEvalCode, assessmentUUID) {
        let sourceIndicatorDefinitions = _.filter(indicatorDefinitions, (indicatorDefinition) => indicatorDefinition.symbol);

        let evalCode = '';
        sourceIndicatorDefinitions.forEach(indicatorDefinition => {
            let indicator = Indicators.findIndicator(indicators, indicatorDefinition.uuid);
            if (IndicatorDefinition.hasNumericValue(indicatorDefinition))
                evalCode += `var ${indicatorDefinition.symbol} = ${_.isNil(indicator) ? 0 : indicator.numericValue};`;
            else if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Coded)
                evalCode += `var ${indicatorDefinition.symbol} = ${_.isNil(indicator) ? false : indicator.codedValue === 'Yes'};`;
        });
        evalCode += resultsEvalCode;
        let results = eval(evalCode);

        let calculatedIndicatorDefinitions = IndicatorDefinitions.calculatedIndicatorDefinitions(indicatorDefinitions, isOutput);
        let calculatedIndicators = [];
        calculatedIndicatorDefinitions.forEach(indicatorDefinition => {
            let indicator = Indicators.findIndicator(indicators, indicatorDefinition.uuid);
            if (_.isNil(indicator)) indicator = Indicator.newIndicator(indicatorDefinition.uuid, assessmentUUID);

            if (IndicatorDefinition.hasNumericValue(indicatorDefinition))
                indicator.numericValue = _.isNil(results[indicatorDefinition.uuid]) ? 0 : _.round(results[indicatorDefinition.uuid], 1);
            else if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Coded)
                indicator.codedValue = _.isNil(results[indicatorDefinition.uuid]) ? 'No' : results[indicatorDefinition.uuid] ? 'Yes' : 'No';
            calculatedIndicators.push(indicator);
        });
        return calculatedIndicators;
    }
}

export default Indicators;