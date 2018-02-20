class AssessmentTool {
    static schema = {
        name: 'AssessmentTool',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            mode: 'string',
            uuid: 'string',
            assessmentToolType: 'string'
        }
    };

    static COMPLIANCE = "COMPLIANCE";
}


export default AssessmentTool;