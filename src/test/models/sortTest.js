import {expect} from 'chai';
import ChecklistService from '../../js/service/ChecklistService';
import _ from 'lodash';

describe('Reference Sort Test', () => {
    it("Standard Reference Sort", () => {
        let standardReferences = [{reference: "A1"}, {reference: "A5"}, {reference: "A10"}, {reference: "A12"}, {reference: "A21"}, {reference: "A3"}, {reference: "A2"}, {reference: "A100"}, {reference: "A30"}];
        let checklistService = new ChecklistService();
        let sortedStandards = _.sortBy(standardReferences, checklistService.standardRefComparator);
        expect(sortedStandards).to.deep.equals([{reference: "A1"}, {reference: "A2"}, {reference: "A3"}, {reference: "A5"}, {reference: "A10"}, {reference: "A12"}, {reference: "A21"}, {reference: "A30"}, {reference: "A100"}]);
    });
});