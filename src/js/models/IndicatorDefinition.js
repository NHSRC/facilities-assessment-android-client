export default class IndicatorDefinition {
    static schema = {
        name: 'IndicatorDefinition',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            dataType: "string"
        }
    };

    static Numeric = 'Numeric';
    static Boolean = 'Boolean';
    static Date = 'Date';
}