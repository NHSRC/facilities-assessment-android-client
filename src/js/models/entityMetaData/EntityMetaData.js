import _ from "lodash";
import DefaultEntityResourceMapper from "./DefaultEntityResourceMapper";

class EntityMetaData {
    constructor(entityType, parentClass, mapper) {
        this.entityType = entityType;
        this.mapper = _.isNil(mapper) ? DefaultEntityResourceMapper : mapper;
        this.parentClass = parentClass;
    }

    get entityClass() {
        return this.entityType;
    }

    mapFromResource(resource) {
        this.mapper.fromResource(resource);
    }

    get resourceName() {
        return _.camelCase(this.entityType.schema.name);
    }

    get entityName() {
        return this.entityType.schema.name;
    }
}

export default EntityMetaData;