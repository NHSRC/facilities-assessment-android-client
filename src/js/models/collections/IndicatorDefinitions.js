import IndicatorDefinition from "../IndicatorDefinition";

class IndicatorDefinitions {
    static resultsEvalCode(indicatorDefinitions) {
        let evalString = 'let results = {};';
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