import _ from 'lodash';
export default class BaseService {
    constructor(db, beanStore) {
        this.db = db;
        this.beanStore = beanStore;
        this.init = this.init.bind(this);
        this.save = this.save.bind(this);
        this.nameAndId = this.nameAndId.bind(this);
        this.pickKeys = this.pickKeys.bind(this);
    }

    init() {
    }

    getService(name) {
        return this.beanStore.getBean(name);
    }

    fromStringObj(key) {
        return (entity)=> {
            entity[key] = entity[key].map((strObj)=>strObj.value);
            return entity;
        }
    }

    toStringObj(key) {
        return (entity)=> {
            entity[key] = entity[key].map((str)=> {
                return {"value": str}
            });
            return entity;
        };
    }

    pickKeys(keys) {
        return (obj)=>_.pick(obj, ["name", "uuid"].concat(keys));
    }

    nameAndId(obj) {
        return _.pick(obj, ["name", "uuid"])
    }

    save(entityClass, transformFN = _.identity) {
        return (entity)=> {
            this.db.write(()=>this.db.create(entityClass.schema.name, transformFN(entity), true));
            return this.db.objectForPrimaryKey(entityClass.schema.name, entity.uuid);
        }
    }
}