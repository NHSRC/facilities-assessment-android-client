import {expect} from 'chai';
import submitAssessment from "../../js/action/submitAssessment";
import AssessmentTool from "../../js/models/AssessmentTool";
import TestBeanFactory from "../stubs/TestBeanFactory";

describe('FacilitySelectionTest', () => {
    let state = function (series) {
        return {chosenAssessment: {customInfos: [], seriesName: series, assessmentTool: {assessmentToolType: AssessmentTool.COMPLIANCE}}};
    };

    let action = function (series) {
        return {series: series};
    };

    let series = function (state) {
        return state.chosenAssessment.seriesName;
    };

    it('enterSeries', () => {
        let beans = TestBeanFactory.create().addAssessmentMetaDataService().beans;
        let enterAssessmentSeries = submitAssessment.get('ENTER_ASSESSMENT_SERIES');
        let newState = enterAssessmentSeries(state('1'), action('1a'), beans);
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state(''), action('1'), beans);
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state('1'), action(''), beans);
        expect(series(newState)).is.equal('');
    });
});