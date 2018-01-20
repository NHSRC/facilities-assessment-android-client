export default class Indicator {
    static schema = {
        name: 'Indicator',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            numeratorValue: "int",
            denominatorValue: "int",
            indicatorValue: "int",
            facilityAssessment: "string",
            indicatorDefinition: "string"
        }
    };
}