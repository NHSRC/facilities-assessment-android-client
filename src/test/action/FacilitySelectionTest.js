import {expect} from 'chai';
import openAssessments from "../../js/action/openAssessments";
import AssessmentTool from "../../js/models/AssessmentTool";
import AssessmentMetaDataService from "../../js/service/metadata/AssessmentMetaDataService";

describe('FacilitySelectionTest', () => {
    let state = function (series) {
        return {submittingAssessment: {customInfos: [], seriesName: series, assessmentTool: {assessmentToolType: AssessmentTool.COMPLIANCE}}};
    };

    let action = function (series) {
        return {series: series};
    };

    let series = function (state) {
        return state.submittingAssessment.seriesName;
    };

    it('enterSeries', () => {
        let beans = new Map();
        beans.set(AssessmentMetaDataService, {
            getAll: function () {
                return [];
            }
        });
        let enterAssessmentSeries = openAssessments.get('ENTER_ASSESSMENT_SERIES');
        let newState = enterAssessmentSeries(state('1'), action('1a'), beans);
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state(''), action('1'), beans);
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state('1'), action(''), beans);
        expect(series(newState)).is.equal('');
    });
});