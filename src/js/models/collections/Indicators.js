import IndicatorDefinitions from "./IndicatorDefinitions";

class Indicators {
    static findIndicator(indicators, indicatorDefinitionUUID) {
        return indicators.find(indicator => indicator.indicatorDefinition === indicatorDefinitionUUID);
    };

    static evalCalculatedIndicatorValues(indicatorDefinitions, indicators, resultsEvalCode) {
        let sourceIndicatorDefinitions = indicatorDefinitions.filter(indicatorDefinition => indicatorDefinition.symbol);

        let evalCode = '';
        sourceIndicatorDefinitions.forEach(indicatorDefinition => evalCode += `let ${indicatorDefinition.symbol} = ${Indicators.findIndicator(indicators, indicatorDefinition.uuid).numericValue};`);
        evalCode += resultsEvalCode;
        let results = eval(evalCode);

        let calculatedIndicatorDefinitions = IndicatorDefinitions.calculatedIndicatorDefinitions(indicatorDefinitions);
        calculatedIndicatorDefinitions.forEach(indicatorDefinition => Indicators.findIndicator(indicators, indicatorDefinition.uuid).numericValue = results[indicatorDefinition.uuid]);
    }
}

export default Indicators;