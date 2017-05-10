import {expect} from 'chai';
import {makeParams} from '../../../js/framework/http/httpUtils';

describe('Migration Framework Test', () => {
    it("Should return empty string for empty object", () => {
        let params = makeParams({});
        expect(params).to.be.empty;
    });

    it("Should return params without & for only one param", () => {
        let params = makeParams({a: 1});
        expect(params).to.be.equal("a=1");
    });

    it("Should return joined params with multiple params", () => {
        let params = makeParams({a: 1, b: 2, c: "HelloWorld"});
        expect(params).to.be.equal("a=1&b=2&c=HelloWorld");
    });
});