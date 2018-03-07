export default class IndicatorDefinition {
    static schema = {
        name: 'IndicatorDefinition',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            dataType: "string",
            assessmentTool: "string",
            calculated: 'bool',
            formula: {type: 'string', optional: true}
        }
    };

    static Numeric = 'Numeric';
    static Month = 'Month';
    static Percentage = 'Percentage';
    static Boolean = 'Boolean';
    static Date = 'Date';
}