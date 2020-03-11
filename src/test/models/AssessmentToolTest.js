import {expect} from 'chai';
import AssessmentTool from "../../js/models/AssessmentTool";
import ExcludedAssessmentToolState from "../../js/models/ExcludedAssessmentToolState";
import State from "../../js/models/State";

describe('AssessmentToolTest', () => {
    it('exclusion - 1', () => {
        let assessmentTool = new AssessmentTool();
        assessmentTool.name = "DH";
        assessmentTool.excludedStates = [];

        expect(assessmentTool.isIncludedForState("43c4417c-c57b-461e-a11d-aacc05d66f5c")).is.equal(true);
    });

    it('exclusion - 2', () => {
        let assessmentTool = new AssessmentTool();
        assessmentTool.name = "DH";
        let excludedAssessmentToolState = new ExcludedAssessmentToolState();
        let state = new State();
        state.uuid = '0dc474c2-721b-4d40-80ea-456223cb3c45';
        excludedAssessmentToolState.state = state;
        assessmentTool.excludedStates = [excludedAssessmentToolState];

        expect(assessmentTool.isIncludedForState(state.uuid)).is.equal(false);
    });
});