import _ from "lodash";
import DefaultEntityResourceMapper from "./DefaultEntityResourceMapper";

class EntityMetaData {
    constructor(entityType, mapper) {
        this.entityType = entityType;
        this.mapper = _.isNil(mapper) ? DefaultEntityResourceMapper : mapper;
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
}

export default EntityMetaData;