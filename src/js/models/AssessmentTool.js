class AssessmentTool {
    static COMPLIANCE = "COMPLIANCE";

    static schema = {
        name: 'AssessmentTool',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            mode: 'string',
            uuid: 'string',
            assessmentToolType: {type: 'string', default: "COMPLIANCE"}
        }
    };
}


export default AssessmentTool;