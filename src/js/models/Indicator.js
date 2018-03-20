import UUID from "../utility/UUID";

export default class Indicator {
    static schema = {
        name: 'Indicator',
        primaryKey: 'uuid',
        properties: {
            uuid: "string",
            numericValue: {type: "double", optional: true},
            dateValue: {type: "date", optional: true},
            codedValue: {type: "string", optional: true},
            facilityAssessment: "string",
            indicatorDefinition: "string"
        }
    };

    static newIndicator(indicatorDefinitionUUID, assessmentUUID) {
        let indicator = new Indicator();
        indicator.uuid = UUID.generate();
        indicator.indicatorDefinition = indicatorDefinitionUUID;
        indicator.facilityAssessment = assessmentUUID;
        return indicator;
    }

    static createDTO(indicator) {
        return {
            uuid: indicator.uuid,
            indicatorDefinition: indicator.indicatorDefinition,
            numericValue: indicator.numericValue,
            dateValue: indicator.dateValue,
            codedValue: indicator.codedValue
        };
    }
}