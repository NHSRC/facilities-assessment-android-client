import {expect} from 'chai';
import openAssessments from "../../js/action/openAssessments";
import AssessmentTool from "../../js/models/AssessmentTool";

describe('FacilitySelectionTest', () => {
    let state = function (series) {
        return {submittingAssessment: {seriesName: series, assessmentTool: {assessmentToolType: AssessmentTool.COMPLIANCE}}};
    };

    let action = function (series) {
        return {series: series};
    };

    let series = function (state) {
        return state.submittingAssessment.seriesName;
    };

    it('enterSeries', () => {
        let enterAssessmentSeries = openAssessments.get('ENTER_ASSESSMENT_SERIES');
        let newState = enterAssessmentSeries(state('1'), action('1a'));
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state(''), action('1'));
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state('1'), action(''));
        expect(series(newState)).is.equal('');
    });
});