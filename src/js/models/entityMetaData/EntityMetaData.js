import _ from "lodash";
import DefaultEntityResourceMapper from "./DefaultEntityResourceMapper";
import EntityService from "../../service/EntityService";
import Logger from "../../framework/Logger";

class EntityMetaData {
    constructor(entityType, parentClass, mapper, serviceClass) {
        this.entityType = entityType;
        this.mapper = _.isNil(mapper) ? DefaultEntityResourceMapper : mapper;
        this.parentClass = parentClass;
        this.serviceClass = _.isNil(serviceClass) ? EntityService : serviceClass;
    }

    get entityClass() {
        return this.entityType;
    }

    mapFromResource(resource) {
        this.mapper.fromResource(resource);
    }

    get resourceName() {
        return _.camelCase(this.entityName);
    }

    get entityName() {
        return _.isNil(this.entityType.schema) ? this.entityType.entityName : this.entityType.schema.name;
    }
}

export default EntityMetaData;