class AssessmentType {
    static schema = {
        name: 'AssessmentType',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string'
        }
    };
}


export default AssessmentType;