import {expect} from 'chai';
import facilitySelection from "../../js/action/facilitySelection";

describe('FacilitySelectionTest', () => {
    it('enterSeries', () => {
        let enterAssessmentSeries = facilitySelection.get('ENTER_ASSESSMENT_SERIES');
        let newState = enterAssessmentSeries({series: '1'}, {series: '1a'});
        expect(newState.series).is.equal('1');

        newState = enterAssessmentSeries({series: ''}, {series: '1'});
        expect(newState.series).is.equal('1');

        newState = enterAssessmentSeries({series: '1'}, {series: ''});
        expect(newState.series).is.equal('');
    });
});