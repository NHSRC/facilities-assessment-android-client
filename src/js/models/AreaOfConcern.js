import Standard from "./Standard";
import ResourceUtil from "../utility/ResourceUtil";
import General from "../utility/General";
import BaseEntity from "./BaseEntity";
import EntityMetaData from "./entityMetaData/EntityMetaData";

class AreaOfConcern {
    static schema = {
        name: 'AreaOfConcern',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            standards: {type: 'list', objectType: 'Standard'}
        }
    };

    static fromDB(realmObj) {
        realmObj = Object.assign({}, realmObj);
        realmObj.standards = realmObj.standards.map(Standard.fromDB);
        return realmObj;
    }

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        const schemaName = EntityMetaData.getSchemaName(childEntityClass);
        let areaOfConcern = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "areaOfConcernUUID"), AreaOfConcern.schema.name);
        if (schemaName === Standard.schema.name) {
            areaOfConcern = General.pick(areaOfConcern, ["uuid"], ["standards"]);
            BaseEntity.addOrUpdateChild(areaOfConcern.standards, childEntity);
        } else if (schemaName === "AreaOfConcernTag") {
            areaOfConcern = General.pick(areaOfConcern, ["uuid"], ["tags"]);
            BaseEntity.addOrUpdateChild(areaOfConcern.tags, childEntity);
        }
        return areaOfConcern;
    }
}


export default AreaOfConcern;