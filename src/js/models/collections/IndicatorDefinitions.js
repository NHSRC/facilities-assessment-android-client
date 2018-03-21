import IndicatorDefinition from "../IndicatorDefinition";

class IndicatorDefinitions {
    static resultsEvalCode(indicatorDefinitions, isOutput) {
        let evalString = 'var results = {};';
        let calculatedIndicatorDefinitions = this.calculatedIndicatorDefinitions(indicatorDefinitions, isOutput);
        calculatedIndicatorDefinitions.forEach(calculatedIndicatorDefinition => {
            evalString += `results['${calculatedIndicatorDefinition.uuid}'] = ${calculatedIndicatorDefinition.formula};`;
        });
        evalString += `results`;
        return evalString;
    }

    static calculatedIndicatorDefinitions(indicatorDefinitions, isOutput) {
        return indicatorDefinitions.filter(indicatorDefinition => IndicatorDefinition.isCalculated(indicatorDefinition, isOutput));
    }

    static numberOfInputNumericFields(indicatorDefinitions) {
        return _.filter(indicatorDefinitions, (indicatorDefinition) => IndicatorDefinition.isInputNumeric(indicatorDefinition)).length;
    }
}

export default IndicatorDefinitions;