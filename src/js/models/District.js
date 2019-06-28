import ResourceUtil from "../utility/ResourceUtil";
import BaseEntity from "./BaseEntity";
import General from "../utility/General";

class District {
    static schema = {
        name: 'District',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            facilities: {type: 'list', objectType: 'Facility'}
        }
    };

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        let district = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "districtUUID"), District.schema.name);
        district = General.pick(district, ["uuid"], ["facilities"]);
        if (childEntityClass.schema.name === 'Facility') {
            BaseEntity.addOrUpdateChild(district.facilities, childEntity);
        }
        return district;
    }
}


export default District;