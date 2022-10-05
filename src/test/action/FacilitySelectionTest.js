import {expect} from 'chai';
import submitAssessment from "../../js/action/submitAssessment";
import AssessmentTool from "../../js/models/AssessmentTool";
import TestBeanFactory from "../stubs/TestBeanFactory";
import TestContext from "../TestContext";
import fns from "../../js/action/facilitySelection";
import FacilityAssessment from "../../js/models/FacilityAssessment";
import Theme from "../../js/models/theme/Theme";

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
        let newState = enterAssessmentSeries(state('1'), action('1'), beans);
        expect(series(newState)).is.equal('1');

        newState = enterAssessmentSeries(state('1'), action(''), beans);
        expect(series(newState)).is.equal('');
    });

    it('select themes', () => {
        const testContext = new TestContext();
        const fn = fns.get("THEME_TOGGLED");

        let state = {selectedThemes: []};

        state = fn(state, {theme: Theme.newTheme("uuid-1")}, testContext);
        expect(state.selectedThemes.length).is.equal(1);
        state = fn(state, {theme: Theme.newTheme("uuid-2")}, testContext);
        expect(state.selectedThemes.length).is.equal(2);
        state = fn(state, {theme: Theme.newTheme("uuid-1")}, testContext);
        expect(state.selectedThemes.length).is.equal(1);
    });
});
