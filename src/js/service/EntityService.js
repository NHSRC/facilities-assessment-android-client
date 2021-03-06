import Service from "../framework/bean/Service";
import BaseService from "./BaseService";

@Service('entityService')
class EntityService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    save(entityClass, entity) {
        return super.save(entityClass)(entity);
    }
}

export default EntityService;