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

    it("Measurable Element Reference Sort", () => {
        let meReferences = [{reference: "A1.13"}, {reference: "A1.23"}, {reference: "A1.10"}, {reference: "A1.2"}, {reference: "A1.1"}, {reference: "A1.4"}, {reference: "A1.100"}, {reference: "A1.9"}, {reference: "A1.10"}];
        let checklistService = new ChecklistService();
        let sortedMEs = _.sortBy(meReferences, checklistService.meRefComparator);
        console.log(sortedMEs);
        expect(sortedMEs).to.deep.equals([
            {reference: 'A1.1'},
            {reference: 'A1.2'},
            {reference: 'A1.4'},
            {reference: 'A1.9'},
            {reference: 'A1.10'},
            {reference: 'A1.10'},
            {reference: 'A1.13'},
            {reference: 'A1.23'},
            {reference: 'A1.100'}]);
    });
});