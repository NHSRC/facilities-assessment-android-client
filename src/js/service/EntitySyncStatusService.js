import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntitiesMetaData from '../models/entityMetaData/EntitiesMetaData';
import _ from 'lodash';
import Logger from "../framework/Logger";

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
        this.setup(EntitiesMetaData.allEntityTypes);
    }

    get(entityName) {
        const allEntities = this.db.objects(EntitySyncStatus.schema.name);
        return {...allEntities.filtered('entityName = $0', entityName)[0]};
    }

    deleteEntitySyncStatusFor(entityName) {
        const db = this.db;
        const allEntitySyncStatuses = this.db.objects(EntitySyncStatus.schema.name);
        _.forEach(allEntitySyncStatuses, (entitySyncStatus) => {
            if (!_.isNil(entitySyncStatus) && entitySyncStatus.entityName === entityName)
                db.delete(entitySyncStatus);
        });
    }

    setup(entitiesMetaData) {
        return entitiesMetaData
            .filter((entityMetaData) => _.isEmpty(this.get(entityMetaData.entityName)))
            .map(EntitySyncStatus.create)
            .map(this.saveEntitySyncStatus);
    }
}

export default EntitySyncStatusService;