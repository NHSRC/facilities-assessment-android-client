import _ from 'lodash';
import MeasurableElements from './MeasurableElement';
import ResourceUtil from "../utility/ResourceUtil";
import General from "../utility/General";
import BaseEntity from "./BaseEntity";
import MeasurableElement from './MeasurableElement';
import EntityMetaData from "./entityMetaData/EntityMetaData";

class Standard {
    static schema = {
        name: 'Standard',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            shortName: {type: 'string', optional: true},
            reference: 'string',
            measurableElements: {type: 'list', objectType: 'MeasurableElement'}
        }
    };

    static fromDB(realmObj) {
        realmObj = Object.assign({}, realmObj);
        realmObj.measurableElements = realmObj.measurableElements.map(MeasurableElements.fromDB);
        return realmObj;
    }

    static getDisplayName(standard) {
        return _.isEmpty(standard.shortName) ? `${standard.reference} - ${standard.name}` : `${standard.reference} - ${standard.shortName}`;
    }

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        const schemaName = EntityMetaData.getSchemaName(childEntityClass);
        let standard = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "standardUUID"), Standard.schema.name);
        if (schemaName === MeasurableElement.schema.name) {
            standard = General.pick(standard, ["uuid"], ["measurableElements"]);
            BaseEntity.addOrUpdateChild(standard.measurableElements, childEntity);
        }
        return standard;
    }
}

export default Standard;