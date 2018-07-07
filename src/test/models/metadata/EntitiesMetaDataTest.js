import {expect} from 'chai';
import EntitiesMetaData, {FacilityAssessmentProgress} from "../../../js/models/entityMetaData/EntitiesMetaData";
import Facility from "../../../js/models/Facility";
import FacilityType from "../../../js/models/FacilityType";

describe('EntitiesMetaDataTest', () => {
    it('check counts and order', () => {
        expect(EntitiesMetaData.txEntityTypes.length).is.equal(4);
        expect(EntitiesMetaData.stateSpecificReferenceEntityTypes.length).is.equal(2);

        expect(EntitiesMetaData.referenceEntityTypes.length).is.equal(13);
        expect(EntitiesMetaData.referenceEntityTypes[0].entityClass).is.equal(Facility);
        expect(EntitiesMetaData.referenceEntityTypes[12].entityClass).is.equal(FacilityType);

        expect(EntitiesMetaData.allEntityTypes.length).is.equal(17);
        expect(EntitiesMetaData.allEntityTypes[0].entityClass).is.equal(FacilityAssessmentProgress);
        expect(EntitiesMetaData.allEntityTypes[16].entityClass).is.equal(FacilityType);
    });
});