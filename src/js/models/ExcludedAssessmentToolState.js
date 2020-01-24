class ExcludedAssessmentToolState {
    static schema = {
        name: 'ExcludedAssessmentToolState',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            state: 'State',
            checkpoint: 'AssessmentTool',
            inactive: "bool"
        }
    };
}

export default ExcludedAssessmentToolState;