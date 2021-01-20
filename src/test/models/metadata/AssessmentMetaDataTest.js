import {expect} from 'chai';
import AssessmentMetaData from "../../../js/models/assessment/AssessmentMetaData";

describe('AssessmentMetaDataTest', () => {
    it('matches', () => {
        let assessmentMetaData = new AssessmentMetaData();
        assessmentMetaData.validationRegex = "^[0-9]{10}";
        expect(AssessmentMetaData.matches("9876543210", assessmentMetaData)).is.equal(true);
        expect(AssessmentMetaData.matches("987654321", assessmentMetaData)).is.equal(false);
    });
});