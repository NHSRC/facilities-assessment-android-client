import IndicatorDefinitions from "./IndicatorDefinitions";
import _ from 'lodash';
import Indicator from "../Indicator";

class Indicators {
    static findIndicator(indicators, indicatorDefinitionUUID) {
        return _.find(indicators, (indicator => indicator.indicatorDefinition === indicatorDefinitionUUID));
    };

    static evalCalculatedIndicatorValues(indicatorDefinitions, indicators, resultsEvalCode, assessmentUUID) {
        let sourceIndicatorDefinitions = indicatorDefinitions.filter(indicatorDefinition => indicatorDefinition.symbol);

        let evalCode = '';
        sourceIndicatorDefinitions.forEach(indicatorDefinition => {
            let indicator = Indicators.findIndicator(indicators, indicatorDefinition.uuid);
            evalCode += `var ${indicatorDefinition.symbol} = ${_.isNil(indicator) ? 0 : indicator.numericValue};`
        });
        evalCode += resultsEvalCode;
        let results = eval(evalCode);

        let calculatedIndicatorDefinitions = IndicatorDefinitions.calculatedIndicatorDefinitions(indicatorDefinitions);
        let calculatedIndicators = [];
        calculatedIndicatorDefinitions.forEach(indicatorDefinition => {
            let indicator = Indicators.findIndicator(indicators, indicatorDefinition.uuid);
            if (_.isNil(indicator)) indicator = Indicator.newIndicator(indicatorDefinition.uuid, assessmentUUID);

            indicator.numericValue = _.isNil(results[indicatorDefinition.uuid]) ? 0 : results[indicatorDefinition.uuid];
            calculatedIndicators.push(indicator);
        });
        return calculatedIndicators;
    }
}

export default Indicators;