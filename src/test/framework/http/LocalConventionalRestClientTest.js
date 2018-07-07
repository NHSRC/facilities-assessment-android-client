import {expect} from 'chai';
import LocalConventionalRestClient from "../../../js/framework/http/LocalConventionalRestClient";
import TestContext from "../../TestContext";
import SettingsService from "../../../js/service/SettingsService";
import EntitiesMetaData from "../../../js/models/entityMetaData/EntitiesMetaData";
import District from "../../../js/models/District";
import _ from 'lodash';

describe('Local Conventional Rest Client', () => {
    const defaultDateTime = '2017-01-01T00:00:00.001Z';

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

    const obj = function (str, dateTime = defaultDateTime) {
        return {name: str, lastModifiedDate: dateTime};
    };

    const getObject = function (typeName, response, index) {
        return response['_embedded'][typeName][index];
    };

    const getURL = function (entityType, dateTime = defaultDateTime) {
        return `http://localhost/api/${entityType}/search/lastModified?lastModifiedDate=${dateTime}&size=200&page=0`;
    };

    let localConventionalRestClient;

    beforeEach(() => {
        let fileDataMap = new Map([['common', create('facilityType', [[obj('CHC'), obj('DH'), obj('MC', '2017-08-01T00:00:00.001Z')], [obj('PHC'), obj('CHC')]])],
            ['Bihar', create('district', [[obj('Aarah'), obj('Buxar')], [obj('Patna'), obj('Danapur')]])]]);
        let testContext = new TestContext();
        localConventionalRestClient = new LocalConventionalRestClient(testContext.getService(SettingsService), undefined, fileDataMap);
    });

    it("get non state specific data", () => {
        let cbFile;
        let referenceEntityTypes = EntitiesMetaData.referenceEntityTypes;
        let facilityTypeMetadata = referenceEntityTypes[referenceEntityTypes.length - 1];
        localConventionalRestClient.getData(getURL('facilityType'), facilityTypeMetadata, {}, (file) => {
            cbFile = file
        });
        expect(getObject('facilityType', cbFile, 0).name).to.be.equal('CHC');
        expect(getObject('facilityType', cbFile, 1).name).to.be.equal('DH');
        localConventionalRestClient.getData(getURL('facilityType'), facilityTypeMetadata, {}, (file) => {
            cbFile = file
        });
        expect(getObject('facilityType', cbFile, 0).name).to.be.equal('PHC');
        expect(getObject('facilityType', cbFile, 1).name).to.be.equal('CHC');
    });

    it("get state specific data", () => {
        let cbFile;
        let districtEntityMetadata = _.find(EntitiesMetaData.referenceEntityTypes, (entityMetaData) => entityMetaData.entityClass === District);
        let optionalParams = {name: 'Bihar'};
        localConventionalRestClient.getData(getURL('district'), districtEntityMetadata, optionalParams, (file) => {
            cbFile = file
        });
        expect(getObject('district', cbFile, 0).name).to.be.equal('Aarah');
        localConventionalRestClient.getData(getURL('district'), districtEntityMetadata, optionalParams, (file) => {
            cbFile = file
        });
        expect(getObject('district', cbFile, 0).name).to.be.equal('Patna');
    });

    it('should return only one object ignoring all other objects', () => {
        let cbFile;
        let referenceEntityTypes = EntitiesMetaData.referenceEntityTypes;
        let facilityTypeMetadata = referenceEntityTypes[referenceEntityTypes.length - 1];
        localConventionalRestClient.getData(getURL('facilityType', '2017-02-01T00:00:00.001Z'), facilityTypeMetadata, {}, (file) => {
            cbFile = file
        });
        expect(getObject('facilityType', cbFile, 0).name).to.be.equal('MC');
    });
});