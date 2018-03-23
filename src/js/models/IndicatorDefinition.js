import _ from 'lodash';

export default class IndicatorDefinition {
    static schema = {
        name: 'IndicatorDefinition',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            assessmentTool: "string",
            dataType: "string",
            codedValues: {type: "string", optional: true},
            output: 'bool',
            symbol: {type: "string", optional: true},
            formula: {type: 'string', optional: true},
            sortOrder: 'int'
        }
    };

    static DataType_Percentage = 'Percentage';
    static DataType_Numeric = 'Numeric';
    static DataType_Month = 'Month';
    static DataType_Coded = 'Coded';
    static DataType_Date = 'Date';

    static isCalculated(indicatorDefinition, isOutput) {
        return !_.isNil(indicatorDefinition.formula) && (isOutput === undefined || indicatorDefinition.output === isOutput);
    }

    static getCodedValues(codedValues) {
        return JSON.parse(codedValues);
    }

    static errorMessageFor(indicatorDefinition) {
        let errorMessage = '';
        if (!indicatorDefinition.output) errorMessage += 'MANDATORY. ';
        if (indicatorDefinition.dataType === IndicatorDefinition.DataType_Percentage) errorMessage += '% cannot be > 100';
        return errorMessage;
    }

    static hasNumericValue(indicatorDefinition) {
        return indicatorDefinition.dataType === IndicatorDefinition.DataType_Numeric || indicatorDefinition.dataType === IndicatorDefinition.DataType_Percentage;
    }

    static isFormulaNumeric(indicatorDefinition) {
        return !_.isNil(indicatorDefinition.formula);
    }

    static isInputNumeric(indicatorDefinition) {
        return !IndicatorDefinition.isFormulaNumeric(indicatorDefinition) && IndicatorDefinition.hasNumericValue(indicatorDefinition);
    }
}