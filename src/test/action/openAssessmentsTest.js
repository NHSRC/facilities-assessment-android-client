import {expect} from 'chai';
import fns from '../../js/action/openAssessments';
import _ from "lodash";
import TestBeanFactory from "../stubs/TestBeanFactory";
import AssessmentMetaData from "../../js/models/assessment/AssessmentMetaData";
import AssessmentTool from "../../js/models/AssessmentTool";
import FacilityAssessment from "../../js/models/FacilityAssessment";

describe('openAssessmentsTest', () => {
    it('areSubmissionDetailsAvailable', () => {
        let assessmentMetaData = new AssessmentMetaData();
        assessmentMetaData.uuid = 'eee8cc8d-be00-47df-a72a-9891e1b8f8fb';
        assessmentMetaData.mandatory = true;

        let beans = TestBeanFactory.create().addAssessmentMetaDataService([assessmentMetaData]).beans;
        let enterCustomInfo = fns.get("ENTER_CUSTOM_INFO");
        let enterAssessmentSeries = fns.get("ENTER_ASSESSMENT_SERIES");
        let state = {submittingAssessment: {assessmentTool: {assessmentToolType: AssessmentTool.COMPLIANCE}}};
        state = enterAssessmentSeries(state, {series: ''}, beans);
        expect(state.submissionDetailAvailable).is.equal(false);
        state = enterAssessmentSeries(state, {series: '2020'}, beans);
        expect(state.submissionDetailAvailable).is.equal(false);
        state = enterCustomInfo(state, {valueString: 'Mr Foo Bar', assessmentMetaData: assessmentMetaData}, beans);
        expect(state.submissionDetailAvailable).is.equal(true);
        state = enterCustomInfo(state, {valueString: 'Miss Foo Bar', assessmentMetaData: assessmentMetaData}, beans);
        expect(FacilityAssessment.getCustomInfoValue(assessmentMetaData, state.submittingAssessment)).is.equal('Miss Foo Bar');
    });
});