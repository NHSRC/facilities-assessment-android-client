class Checkpoint {
    static schema = {
        name: 'Checkpoint',
        primaryKey: 'uuid',
        properties: {
            name: "string",
            uuid: "string",
            meansOfVerification: {type: "string", optional: true},
            measurableElement: "string",
            checklist: "string",
            isDefault: {type: "bool", default: true},
            state: {type: "string", optional: true},
            amObservation: {type: 'bool', default: false},
            amStaffInterview: {type: 'bool', default: false},
            amPatientInterview: {type: 'bool', default: false},
            amRecordReview: {type: 'bool', default: false},
            sortOrder: {type: 'int', default: 0}
        }
    };

    static getAssessmentMethods(checkpoint) {
        const ams = {
            "amObservation": "OB",
            "amStaffInterview": "SI",
            "amPatientInterview": "PI",
            "amRecordReview": "RR"
        };
        return Object.keys(ams).filter((am) => checkpoint[am]).map((am) => ams[am]);
    };
}
export default Checkpoint;