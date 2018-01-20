export default class IndicatorDefinition {
    static schema = {
        name: 'IndicatorDefinition',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            numerator: "string",
            denominator: "string",
            formula: "string"
        }
    };
}