class AssessmentTool {
    static schema = {
        name: 'AssessmentTool',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            mode: 'string',
            uuid: 'string'
        }
    }
}


export default AssessmentTool;