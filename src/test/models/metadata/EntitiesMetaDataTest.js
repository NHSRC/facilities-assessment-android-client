import {expect} from 'chai';
import _ from "lodash";
import EntitiesMetaData from "../../../js/models/entityMetaData/EntitiesMetaData";

describe('EntitiesMetaDataTest', () => {
    it('sanity', () => {
        expect(EntitiesMetaData.referenceEntityTypes[0].entityType).is.not.undefined;
    });
});