export default class IndicatorDefinition {
    static schema = {
        name: 'IndicatorDefinition',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            dataType: "string",
            assessmentTool: "string"
        }
    };

    static Numeric = 'Numeric';
    static Month = 'Month';
    static Percentage = 'Percentage';
    static Boolean = 'Boolean';
    static Date = 'Date';
}