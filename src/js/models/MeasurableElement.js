import General from "../utility/General";
import Tag from "./Tag";
import BaseEntity from "./BaseEntity";
import ResourceUtil from "../utility/ResourceUtil";
import EntityMetaData from "./entityMetaData/EntityMetaData";
class MeasurableElement {
    static schema = {
        name: 'MeasurableElement',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            tags: {type: 'list', objectType: 'Tag'},
        }
    };

    static fromDB(realmObj) {
        return realmObj;
    }

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        const schemaName = EntityMetaData.getSchemaName(childEntityClass);
        let meUUID = ResourceUtil.getUUIDFor(childResource, "measurableElementUUID");
        let measurableElement = entityService.findByUUID(meUUID, MeasurableElement.schema.name);
        if (schemaName === "MeasurableElementTag") {
            measurableElement = General.pick(measurableElement, ["uuid"], ["tags"]);
            BaseEntity.addOrUpdateChild(measurableElement.tags, childEntity);
        }
        return measurableElement;
    }
}

export default MeasurableElement;