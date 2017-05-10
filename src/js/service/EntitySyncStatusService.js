import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntitiesMetaData from '../models/entityMetaData/EntitiesMetaData';
import _ from 'lodash';

@Service("entitySyncStatusService")
class EntitySyncStatusService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveEntitySyncStatus = this.save(EntitySyncStatus);
    }

    getSchema() {
        return EntitySyncStatus.schema.name;
    }

    init() {
        this.setup(EntitiesMetaData.referenceEntityTypes);
    }

    get(entityName) {
        const allEntities = this.db.objects(EntitySyncStatus.schema.name);
        return {...allEntities.filtered('entityName = $0', entityName)[0]};
    }

    setup(entitiesMetaData) {
        return entitiesMetaData
            .filter((entityMetaData) => _.isEmpty(this.get(entityMetaData.entityName)))
            .map(EntitySyncStatus.create)
            .map(this.saveEntitySyncStatus);
    }
}

export default EntitySyncStatusService;