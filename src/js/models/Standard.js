import MeasurableElements from './MeasurableElement';
import ResourceUtil from "../utility/ResourceUtil";
import General from "../utility/General";
import BaseEntity from "./BaseEntity";
import MeasurableElement from './MeasurableElement';

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
        var standard = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "standardUUID"), Standard.schema.name);
        standard = General.pick(standard, ["uuid"], ["measurableElements"]);
        if (childEntityClass.schema.name === MeasurableElement.schema.name) {
            BaseEntity.addOrUpdateChild(standard.measurableElements, childEntity);
        }
        return standard;
    }
}

export default Standard;