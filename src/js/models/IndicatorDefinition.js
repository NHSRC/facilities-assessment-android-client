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

    static DataType_Numeric = 'Numeric';
    static DataType_Month = 'Month';
    static DataType_Coded = 'Coded';
    static DataType_Date = 'Date';

    static isCalculatedInput(indicatorDefinition) {
        return !_.isNil(indicatorDefinition.formula) && !indicatorDefinition.output;
    }

    static getCodedValues(codedValues) {
        return JSON.parse(codedValues);
    }
}