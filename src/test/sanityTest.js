import {expect} from 'chai';

describe('Sanity Test', () => {
    it('True is True Also True is not False, while False is False, and false aint true', () => {
        expect(true).is.true;
        expect(true).is.not.false;
        expect(false).is.false;
        expect(false).is.not.true;
    });
});