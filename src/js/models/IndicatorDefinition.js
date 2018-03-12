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
            calculated: 'bool',
            output: 'bool',
            symbol: {type: "string", optional: true},
            formula: {type: 'string', optional: true},
            sortOrder: 'int'
        }
    };

    static DataType_Numeric = 'Numeric';
    static DataType_Month = 'Month';
    static DataType_Percentage = 'Percentage';
    static DataType_Coded = 'Coded';
    static DataType_Date = 'Date';

    static isCalculatedInput(indicatorDefinition) {
        return indicatorDefinition.calculated && !indicatorDefinition.output;
    }

    static getCodedValues(codedValues) {
        return JSON.parse(codedValues);
    }
}