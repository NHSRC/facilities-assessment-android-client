import {expect} from 'chai';
import fns from '../../js/action/submitAssessment';
import TestBeanFactory from "../stubs/TestBeanFactory";
import AssessmentMetaData from "../../js/models/assessment/AssessmentMetaData";
import AssessmentTool from "../../js/models/AssessmentTool";
import FacilityAssessment from "../../js/models/FacilityAssessment";

describe('openAssessmentsTest', () => {
    let enterCustomInfo;
    let enterAssessmentSeries;
    let beans;
    let assessmentMetaData;

    beforeEach(() => {
        assessmentMetaData = new AssessmentMetaData();
        assessmentMetaData.uuid = 'eee8cc8d-be00-47df-a72a-9891e1b8f8fb';
        assessmentMetaData.mandatory = true;

        beans = TestBeanFactory.create().addAssessmentMetaDataService([assessmentMetaData]).beans;
        enterCustomInfo = fns.get("ENTER_CUSTOM_INFO");
        enterAssessmentSeries = fns.get("ENTER_ASSESSMENT_SERIES");
    });

    it('areSubmissionDetailsAvailable - series filled first', () => {
        let state = {chosenAssessment: {assessmentTool: {assessmentToolType: AssessmentTool.COMPLIANCE}, customInfos: []}};
        state = enterAssessmentSeries(state, {series: ''}, beans);
        expect(state.submissionDetailAvailable).is.equal(false);
        state = enterAssessmentSeries(state, {series: '2020'}, beans);
        expect(state.submissionDetailAvailable).is.equal(false);
        state = enterCustomInfo(state, {valueString: 'Mr Foo Bar', assessmentMetaData: assessmentMetaData}, beans);
        expect(state.submissionDetailAvailable).is.equal(true);
        state = enterCustomInfo(state, {valueString: 'Miss Foo Bar', assessmentMetaData: assessmentMetaData}, beans);
        expect(FacilityAssessment.getCustomInfoValue(assessmentMetaData, state.chosenAssessment)).is.equal('Miss Foo Bar');
    });

    it('areSubmissionDetailsAvailable - custom info filled first', () => {
        let state = {chosenAssessment: {assessmentTool: {assessmentToolType: AssessmentTool.COMPLIANCE}, customInfos: []}};
        state = enterCustomInfo(state, {valueString: 'Mr Foo Bar', assessmentMetaData: assessmentMetaData}, beans);
        expect(state.submissionDetailAvailable).is.equal(false);
        state = enterCustomInfo(state, {valueString: 'Miss Foo Bar', assessmentMetaData: assessmentMetaData}, beans);
        expect(FacilityAssessment.getCustomInfoValue(assessmentMetaData, state.chosenAssessment)).is.equal('Miss Foo Bar');

        state = enterAssessmentSeries(state, {series: ''}, beans);
        expect(state.submissionDetailAvailable).is.equal(false);
        state = enterAssessmentSeries(state, {series: '2020'}, beans);
        expect(state.submissionDetailAvailable).is.equal(true);
    });
});