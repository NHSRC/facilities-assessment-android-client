import _ from "lodash";
import Logger from "../framework/Logger";

export default class BaseService {
    constructor(db, beanStore) {
        this.db = db;
        this.beanStore = beanStore;
        this.init = this.init.bind(this);
        this.postInit = this.postInit.bind(this);
        this.save = this.save.bind(this);
        this.nameAndId = this.nameAndId.bind(this);
        this.pickKeys = this.pickKeys.bind(this);
    }

    init() {
    }

    postInit() {
    }

    getService(name) {
        return this.beanStore.getBean(name);
    }

    fromStringObj(key) {
        return (entity) => {
            entity[key] = entity[key].map((strObj) => strObj.value);
            return entity;
        }
    }

    toStringObj(key) {
        return (entity) => {
            entity[key] = entity[key].map((str) => {
                return {"value": str}
            });
            return entity;
        };
    }

    pickKeys(keys) {
        return (obj) => _.pick(obj, ["name", "uuid"].concat(keys));
    }

    nameAndId(obj) {
        return _.pick(obj, ["name", "uuid"]);
    }

    onlyId({uuid}) {
        return uuid;
    }

    get schemaName() {
    }

    save(entityClass, transformFN = _.identity) {
        return (entity) => {
            this.db.write(() => this.db.create(entityClass.schema.name, transformFN(entity), true));
            return this.db.objectForPrimaryKey(entityClass.schema.name, entity.uuid);
        }
    }

    findByUUID(uuid, schema = this.schemaName) {
        if (_.isEmpty(uuid)) throw Error("UUID is empty or null");
        let entity = this.findByKey("uuid", uuid, schema);
        if (_.isNil(entity)) Logger.logDebug('BaseService', `${schema} of uuid=${uuid} not found.`);
        return entity;
    }

    findByName(name, schemaName = this.schemaName) {
        return this.findByKey('name', name, schemaName);
    }

    findByKey(keyName, value, schemaName) {
        const entities = this.findAllByKey(keyName, value, schemaName);
        return this.getReturnValue(entities);
    }

    findAllByKey(keyName, value, schemaName) {
        return this.findAllByCriteria(`${keyName}="${value}"`, schemaName);
    }

    findAllByCriteria(filterCriteria, schema) {
        return this.db.objects(schema).filtered(filterCriteria);
    }

    findByCriteria(filterCriteria, entityClass) {
        let all = this.findAllByCriteria(filterCriteria, entityClass.schema.name);
        return this.getReturnValue(all);
    }

    findAll(entityClass) {
        return this.db.objects(entityClass.schema.name);
    }

    findOne(entityClass) {
        let all = this.findAll(entityClass);
        return this.getReturnValue(all);
    }

    getReturnValue(entities) {
        if (entities.length === 0) return undefined;
        if (entities.length === 1) return entities[0];
        return entities;
    }

    saveWithinTx(entityClass, entity) {
        this.db.create(entityClass.schema.name, entity, true);
        return this.db.objectForPrimaryKey(entityClass.schema.name, entity.uuid);
    }
}