class Checkpoint {
    static assessmentMethodNameMap = {
        "amObservation": "OB",
        "amStaffInterview": "SI",
        "amPatientInterview": "PI",
        "amRecordReview": "RR"
    };

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
            sortOrder: {type: 'int', default: 0},
            scoreLevels: {type: 'int', default: 3},
            optional: {type: 'bool', default: false}
        }
    };

    static getAssessmentMethods(checkpoint) {
        return Object.keys(Checkpoint.assessmentMethodNameMap).filter((am) => checkpoint[am]).map((am) => Checkpoint.assessmentMethodNameMap[am]);
    };
}
export default Checkpoint;