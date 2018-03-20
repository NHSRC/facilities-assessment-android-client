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
}

export default IndicatorDefinitions;