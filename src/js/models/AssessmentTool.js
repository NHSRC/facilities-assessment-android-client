class AssessmentTool {
    static COMPLIANCE = "COMPLIANCE";
    static INDICATOR = "INDICATOR";

    static schema = {
        name: 'AssessmentTool',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            mode: 'string',
            uuid: 'string',
            assessmentToolType: {type: 'string', default: "COMPLIANCE"},
            inactive: {type: "bool", default: false},
            excludedStates: {type: "list", objectType: "ExcludedAssessmentToolState"}
        }
    };

    static isApplicable(assessmentTool, stateUUID) {
        let excluded = _.some(assessmentTool.excludedStates, (excludedState) => excludedState.uuid === stateUUID && !excludedState.inactive);
        if (assessmentTool.state === stateUUID) return !assessmentTool.inactive;
        if (_.isNil(assessmentTool.state)) return !assessmentTool.inactive && !excluded;
        return false;
    }
}


export default AssessmentTool;