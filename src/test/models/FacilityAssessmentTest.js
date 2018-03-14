import {expect} from 'chai';
import _ from "lodash";
import FacilityAssessment from "../../js/models/FacilityAssessment";

describe('FacilityAssessmentTest', () => {
    let assessment = function (assessor, series) {
        let facilityAssessment = new FacilityAssessment();
        facilityAssessment.assessorName = assessor;
        facilityAssessment.seriesName = series;
        return facilityAssessment;
    };

    it('submissionDetailsAvailable', () => {
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('', ''))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('', 'a'))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('b', ''))).is.equal(false);
        expect(FacilityAssessment.submissionDetailsAvailable(assessment('b', 'x'))).is.equal(true);
    });
});