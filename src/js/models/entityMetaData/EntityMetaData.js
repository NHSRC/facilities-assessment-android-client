import _ from "lodash";
import DefaultEntityResourceMapper from "./DefaultEntityResourceMapper";
import EntityService from "../../service/EntityService";

class EntityMetaData {
    constructor({entityType, parentClass, mapper = new DefaultEntityResourceMapper(), pageSize = 200, syncWeight, serviceClass = EntityService}) {
        this.entityType = entityType;
        this.mapper = mapper;
        this.parentClass = parentClass;
        this.serviceClass = serviceClass;
        this.pageSize = pageSize;
        this.syncWeight = syncWeight;
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

    get displayName() {
        return _.join(_.words(this.resourceName), ' ').toLowerCase();
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

    clone() {
        return new EntityMetaData({entityType: this.entityType, parentClass: this.parentClass, mapper: this.mapper, pageSize: this.pageSize, syncWeight: this.syncWeight, serviceClass: this.serviceClass});
    }
}

export default EntityMetaData;
