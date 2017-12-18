import _ from "lodash";
import DefaultEntityResourceMapper from "./DefaultEntityResourceMapper";
import EntityService from "../../service/EntityService";
import Logger from "../../framework/Logger";

class EntityMetaData {
    constructor(entityType, parentClass, mapper, serviceClass) {
        this.entityType = entityType;
        this.mapper = _.isNil(mapper) ? new DefaultEntityResourceMapper() : mapper;
        this.parentClass = parentClass;
        this.serviceClass = _.isNil(serviceClass) ? EntityService : serviceClass;
    }

    get entityClass() {
        return this.entityType;
    }

    mapFromResource(resource) {
        return this.mapper.fromResource(resource);
    }

    get resourceName() {
        return `${_.camelCase(this.entityName)}`;
    }

    get entityName() {
        return this.isMappedToDb ? this.entityType.schema.name : this.entityType.entityName;
    }

    getSyncStatusEntityName(state) {
        return _.isNil(state) ? this.entityName : `${this.entityName} - ${state}`;
    }

    get isMappedToDb() {
        return !_.isNil(this.entityType.schema);
    }
    static getSchemaName(entityClass){
        return _.isEmpty(entityClass.schema) ? entityClass.entityName : entityClass.schema.name;
    }
}

export default EntityMetaData;