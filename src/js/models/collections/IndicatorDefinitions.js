import IndicatorDefinition from "../IndicatorDefinition";

class IndicatorDefinitions {
    static resultsEvalCode(indicatorDefinitions) {
        let evalString = 'var results = {};';
        let calculatedIndicatorDefinitions = this.calculatedIndicatorDefinitions(indicatorDefinitions);
        calculatedIndicatorDefinitions.forEach(calculatedIndicatorDefinition => {
            evalString += `results['${calculatedIndicatorDefinition.uuid}'] = ${calculatedIndicatorDefinition.formula};`;
        });
        evalString += `results`;
        return evalString;
    }

    static calculatedIndicatorDefinitions(indicatorDefinitions) {
        return indicatorDefinitions.filter(indicatorDefinition => IndicatorDefinition.isCalculatedInput(indicatorDefinition));
    }
}

export default IndicatorDefinitions;