import {expect} from 'chai';
import realmObj from '../../js/models/index';

describe('Migration Framework Test', () => {
    it("Shouldn't run migrations if version is up to date", () => {
        let oldObjs = [{syncedUuid: "94b62f0b-58f8-43c5-aff9-cbdcea101559"}];
        let oldDB = {schemaVersion: 1, objects: () => oldObjs};
        let newObjs = [{syncedUuid: "94b62f0b-58f8-43c5-aff9-cbdcea101559"}];
        let newDB = {schemaVersion: 1, objects: () => newObjs};
        realmObj.migration(oldDB, newDB);
        expect(newDB.objects()).to.deep.equal([{syncedUuid: "94b62f0b-58f8-43c5-aff9-cbdcea101559"}]);
    });

    it("Should run migrations if version is old", () => {
        let oldObjs = [{name: "Something"}];
        let newObjs = [{name: "Something"}];
        let oldDB = {schemaVersion: 0, objects: () => oldObjs};
        let newDB = {schemaVersion: 1, objects: () => newObjs};
        realmObj.migration(oldDB, newDB);
        expect(newDB.objects()).to.deep.equal([{name: "Something", syncedUuid: null}]);
    })
});