import _ from 'lodash';

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
            excludedStates: {type: "list", objectType: "ExcludedAssessmentToolState"},
            stateUUID: {type: 'string', optional: true}
        }
    };

    isIncludedForState(stateUUID) {
        return !_.some(this.excludedStates, (excludedState) => excludedState.state.uuid === stateUUID) && (_.isNil(this.stateUUID) || this.stateUUID === stateUUID);
    }
}


export default AssessmentTool;