export default class Indicator {
    static schema = {
        name: 'Indicator',
        primaryKey: 'uuid',
        properties: {
            uuid: "string",
            numericValue: {type: "int", optional: true},
            dateValue: {type: "date", optional: true},
            boolValue: {type: "bool", optional: true},
            facilityAssessment: "string",
            indicatorDefinition: "string"
        }
    };
}