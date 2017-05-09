import Standard from "./Standard";
import ResourceUtil from "../utility/ResourceUtil";
import General from "../utility/General";
import BaseEntity from "./BaseEntity";
class AreaOfConcern {
    static schema = {
        name: 'AreaOfConcern',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            tags: {type: 'list', objectType: 'Tag'},
            standards: {type: 'list', objectType: 'Standard'}
        }
    };

    static fromDB(realmObj) {
        realmObj = Object.assign({}, realmObj);
        realmObj.standards = realmObj.standards.map(Standard.fromDB);
        return realmObj;
    }

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        var areaOfConcern = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "areaOfConcernUUID"), AreaOfConcern.schema.name);
        areaOfConcern = General.pick(areaOfConcern, ["uuid"], ["standards"]);
        if (childEntityClass.schema.name === Standard.schema.name) {
            BaseEntity.addOrUpdateChild(areaOfConcern.standards, childEntity);
        }
        return areaOfConcern;
    }
}


export default AreaOfConcern;