import {expect} from 'chai';
import ResourceUtil from "../../js/utility/ResourceUtil";

describe('ResourceUtilTest', () => {
    it('getUUIDsFor', () => {
        const resource = {"_links": {"areasOfConcernUUIDs" : {"href" : "4ab17b2a-1dcd-4fa5-a086-1d1875106a19"}}};
        expect(ResourceUtil.getUUIDsFor(resource, "areasOfConcernUUIDs").length).is.equal(1);
    });
});