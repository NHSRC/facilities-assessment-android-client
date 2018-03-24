import {expect} from 'chai';
import _ from "lodash";
import FacilityAssessment from "../../js/models/FacilityAssessment";
import AssessmentTool from "../../js/models/AssessmentTool";

describe('FacilityAssessmentTest', () => {
    let assessment = function (assessor, series) {
        let facilityAssessment = new FacilityAssessment();
        facilityAssessment.assessorName = assessor;
        facilityAssessment.seriesName = series;
        return facilityAssessment;
    };

    let assessmentTool = function (type) {
        let assessmentTool = new AssessmentTool();
        assessmentTool.assessmentToolType = type;
        return assessmentTool;
    };

    it('submissionDetailsAvailable', () => {
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('', ''), assessmentTool(AssessmentTool.COMPLIANCE))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('', 'a'), assessmentTool(AssessmentTool.COMPLIANCE))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('b', ''), assessmentTool(AssessmentTool.COMPLIANCE))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('b', 'x'), assessmentTool(AssessmentTool.COMPLIANCE))).is.equal(true);

        expect(FacilityAssessment.submissionDetailsAvailable(assessment(''), assessmentTool(AssessmentTool.INDICATOR))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('b'), assessmentTool(AssessmentTool.INDICATOR))).is.equal(true);
    });
});