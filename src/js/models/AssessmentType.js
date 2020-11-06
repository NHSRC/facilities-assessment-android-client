class AssessmentType {
    // Mode is optional for backward compatibility purposes only
    static schema = {
        name: 'AssessmentType',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
            inactive: {type: "bool", default: false},
            mode: {type: 'string', optional: true}
        }
    };
}


export default AssessmentType;