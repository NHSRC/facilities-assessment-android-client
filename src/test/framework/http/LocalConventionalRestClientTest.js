import {expect} from 'chai';
import LocalConventionalRestClient from "../../../js/framework/http/LocalConventionalRestClient";
import TestContext from "../../TestContext";
import SettingsService from "../../../js/service/SettingsService";
import EntitiesMetaData from "../../../js/models/entityMetaData/EntitiesMetaData";

describe('Local Conventional Rest Client', () => {
    const create = function (typeName, pagesContent) {
        let pages = [];
        pagesContent.forEach((pageContent) => {
            let embedded = {};
            let page = {"_embedded": embedded};
            embedded[typeName] = pageContent;
            pages.push(page);
        });
        return pages;
    };

    const obj = function (str, date) {
        return {name: str, lastModifiedDate: date};
    };

    const getObject = function (typeName, response, index) {
        return response['_embedded'][typeName][index];
    };

    let localConventionalRestClient;

    beforeEach(() => {
        let fileDataMap = new Map([['common', create('facilityType', [[obj('CHC', "2017-11-05T11:58:47.671+0000"), obj('DH', "2017-11-05T11:58:47.671+0000")], [obj('PHC', "2017-11-06T11:58:47.671+0000"), obj('CHC', "2017-11-06T11:58:47.671+0000")]])],
            ['Bihar', create('district', [[obj('Aarah', "2017-11-06T11:58:47.671+0000"), obj('Buxar', "2017-11-06T11:58:47.671+0000")], [obj('Patna', "2017-11-06T11:58:47.671+0000"), obj('Danapur', "2017-11-06T11:58:47.671+0000")]])]]);
        let testContext = new TestContext();
        localConventionalRestClient = new LocalConventionalRestClient(testContext.getService(SettingsService), undefined, fileDataMap);
    });

    it("get non state specific data", () => {
        let cbFile;
        let referenceEntityTypes = EntitiesMetaData.referenceEntityTypes;
        let facilityTypeMetadata = referenceEntityTypes[referenceEntityTypes.length - 1];
        localConventionalRestClient.getData('ft', facilityTypeMetadata, {}, (file) => {
            cbFile = file
        });
        expect(getObject('facilityType', cbFile, 0).name).to.be.equal('CHC');
        localConventionalRestClient.getData('ft', facilityTypeMetadata, {}, (file) => {
            cbFile = file
        });
        expect(getObject('facilityType', cbFile, 0).name).to.be.equal('PHC');
    });

    it("get state specific data", () => {
        let cbFile;
        let referenceEntityTypes = EntitiesMetaData.referenceEntityTypes;
        let districtEntityMetadata = referenceEntityTypes[referenceEntityTypes.length - 3];
        let optionalParams = {name: 'Bihar'};
        localConventionalRestClient.getData('foo', districtEntityMetadata, optionalParams, (file) => {
            cbFile = file
        });
        expect(getObject('district', cbFile, 0).name).to.be.equal('Aarah');
        localConventionalRestClient.getData('foo', districtEntityMetadata, optionalParams, (file) => {
            cbFile = file
        });
        expect(getObject('district', cbFile, 0).name).to.be.equal('Patna');
    });

    it('should return only one object ignoring all other objects', () => {
    });
});