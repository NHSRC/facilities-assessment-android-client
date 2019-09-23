class AssessmentType {
    static schema = {
        name: 'AssessmentType',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
            inactive: {type: "bool", default: false}
        }
    };
}


export default AssessmentType;