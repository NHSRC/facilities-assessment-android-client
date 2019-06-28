import {expect} from 'chai';
import {FacilitySelectionState} from "../../js/action/facilitySelection";
import EntityFactory from "../models/EntityFactory";

describe('FacilitySelectionStateTest', () => {
    let state = function (assessmentToolName, assessmentType, facilityName, codedFacilityName, facilityTypeName) {
        let s = {};
        s.selectedAssessmentTool =  EntityFactory.assessmentTool(assessmentToolName);
        s.selectedAssessmentType =  EntityFactory.assessmentType(assessmentType);
        s.facilityName =  facilityName;
        s.selectedFacility =  EntityFactory.facility(codedFacilityName);
        s.selectedFacilityType = EntityFactory.facilityType(facilityTypeName);
        return s;
    };

    it('isFacilityChosen', () => {
        expect(FacilitySelectionState.isFacilityChosen(state())).is.false;
        expect(FacilitySelectionState.isFacilityChosen(state('KK', 'Peer', 'F', null, 'PHC'))).is.true;
        expect(FacilitySelectionState.isFacilityChosen(state('KK', 'Peer'))).is.false;
        expect(FacilitySelectionState.isFacilityChosen(state('KK', 'Peer', null, 'Kahao'))).is.false;
        expect(FacilitySelectionState.isFacilityChosen(state('KK', 'Peer', null, 'Kahao', 'PHC'))).is.true;
        expect(FacilitySelectionState.isFacilityChosen(state('KK', null, null, 'Kahao', 'PHC'))).is.false;
    });
});