import {expect} from 'chai';
import General from "../../js/utility/General";

describe('GeneralTest', () => {
    it('remove spaces', () => {
        expect(General.removeSpaces("A and N Islands")).is.equal("AandNIslands");
    });

    it('should get display for a date as month', function () {
        expect(General.getDisplayMonth(new Date(2018, 2, 10))).is.equal('March 2018');
    });
});