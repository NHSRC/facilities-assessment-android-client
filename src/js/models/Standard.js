import MeasurableElements from './MeasurableElement';
import ResourceUtil from "../utility/ResourceUtil";
import General from "../utility/General";
import BaseEntity from "./BaseEntity";
import MeasurableElement from './MeasurableElement';
import Tag from "./Tag";
import EntityMetaData from "./entityMetaData/EntityMetaData";

class Standard {
    static schema = {
        name: 'Standard',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            tags: {type: 'list', objectType: 'Tag'},
            measurableElements: {type: 'list', objectType: 'MeasurableElement'}
        }
    };

    static fromDB(realmObj) {
        realmObj = Object.assign({}, realmObj);
        realmObj.measurableElements = realmObj.measurableElements.map(MeasurableElements.fromDB);
        return realmObj;
    }

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        const schemaName = EntityMetaData.getSchemaName(childEntityClass);
        let standard = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "standardUUID"), Standard.schema.name);
        if (schemaName === MeasurableElement.schema.name) {
            standard = General.pick(standard, ["uuid"], ["measurableElements"]);
            BaseEntity.addOrUpdateChild(standard.measurableElements, childEntity);
        } else if (schemaName === "StandardTag") {
            standard = General.pick(standard, ["uuid"], ["tags"]);
            BaseEntity.addOrUpdateChild(standard.tags, childEntity);
        }
        return standard;
    }
}

export default Standard;