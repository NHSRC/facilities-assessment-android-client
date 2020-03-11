class ExcludedAssessmentToolState {
    static schema = {
        name: 'ExcludedAssessmentToolState',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            state: 'State',
            assessmentTool: 'AssessmentTool',
            inactive: "bool"
        }
    };
}

export default ExcludedAssessmentToolState;