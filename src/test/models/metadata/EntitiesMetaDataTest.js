import {expect} from 'chai';
import EntitiesMetaData, {FacilityAssessmentProgress} from "../../../js/models/entityMetaData/EntitiesMetaData";
import AssessmentTool from "../../../js/models/AssessmentTool";

describe('EntitiesMetaDataTest', () => {
    it('check counts and order', () => {
        expect(EntitiesMetaData.txEntityTypes.length).is.equal(4);
        expect(EntitiesMetaData.stateSpecificReferenceEntityTypes.length).is.equal(6);

        expect(EntitiesMetaData.allEntityTypes.length).is.equal(21);
        expect(EntitiesMetaData.allEntityTypes[0].entityClass).is.equal(FacilityAssessmentProgress);
        expect(EntitiesMetaData.allEntityTypes[18].entityClass).is.equal(AssessmentTool);
    });
});