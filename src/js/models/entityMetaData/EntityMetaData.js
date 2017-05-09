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

    get isMappedToDb() {
        return !_.isNil(this.entityType.schema);
    }
}

export default EntityMetaData;