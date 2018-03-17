import IndicatorDefinitions from "./IndicatorDefinitions";
import _ from 'lodash';
import Indicator from "../Indicator";
import IndicatorDefinition from "../IndicatorDefinition";

class Indicators {
    static findIndicator(indicators, indicatorDefinitionUUID) {
        return _.find(indicators, (indicator => indicator.indicatorDefinition === indicatorDefinitionUUID));
    };

    static evalCalculatedIndicatorValues(indicatorDefinitions, indicators, resultsEvalCode, assessmentUUID) {
        let sourceIndicatorDefinitions = indicatorDefinitions.filter(indicatorDefinition => indicatorDefinition.symbol);

        let evalCode = '';
        sourceIndicatorDefinitions.forEach(indicatorDefinition => {
            let indicator = Indicators.findIndicator(indicators, indicatorDefinition.uuid);
            if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Numeric)
                evalCode += `var ${indicatorDefinition.symbol} = ${_.isNil(indicator) ? 0 : indicator.numericValue};`;
            else if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Coded)
                evalCode += `var ${indicatorDefinition.symbol} = ${_.isNil(indicator) ? false : indicator.codedValue === 'Yes'};`;
        });
        evalCode += resultsEvalCode;
        let results = eval(evalCode);

        let calculatedIndicatorDefinitions = IndicatorDefinitions.calculatedIndicatorDefinitions(indicatorDefinitions);
        let calculatedIndicators = [];
        calculatedIndicatorDefinitions.forEach(indicatorDefinition => {
            let indicator = Indicators.findIndicator(indicators, indicatorDefinition.uuid);
            if (_.isNil(indicator)) indicator = Indicator.newIndicator(indicatorDefinition.uuid, assessmentUUID);

            if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Numeric || indicatorDefinition.dataType === IndicatorDefinition.DataType_Percentage)
                indicator.numericValue = _.isNil(results[indicatorDefinition.uuid]) ? 0 : results[indicatorDefinition.uuid];
            else if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Coded)
                indicator.codedValue = _.isNil(results[indicatorDefinition.uuid]) ? 'No' : results[indicatorDefinition.uuid] ? 'Yes' : 'No';
            calculatedIndicators.push(indicator);
        });
        return calculatedIndicators;
    }
}

export default Indicators;