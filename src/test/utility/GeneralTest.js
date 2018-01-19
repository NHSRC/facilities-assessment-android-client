import {expect} from 'chai';
import ResourceUtil from "../../js/utility/ResourceUtil";
import General from "../../js/utility/General";

describe('GeneralTest', () => {
    it('remove spaces', () => {
        expect(General.removeSpaces("A and N Islands")).is.equal("AandNIslands");
    });
});