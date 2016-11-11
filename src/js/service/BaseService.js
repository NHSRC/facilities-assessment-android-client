export default class BaseService {
    constructor(db, beanStore) {
        this.db = db;
        this.beanStore = beanStore;
        this.init = this.init.bind(this);
        this.save = this.save.bind(this);
        this.nameAndId = this.nameAndId.bind(this);
    }

    init() {
    }

    getService(name) {
        return this.beanStore.getBean(name);
    }

    nameAndId(obj) {
        return _.pick(obj, ["name", "uuid"])
    }

    save(entityClass) {
        return (entity)=> {
            this.db.write(()=>this.db.create(entityClass.schema.name, entity, true));
            return this.db.objectForPrimaryKey(entityClass.schema.name, entity.uuid);
        }
    }
}