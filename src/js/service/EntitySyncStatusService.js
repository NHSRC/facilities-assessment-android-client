import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import _ from "lodash";
import UUID from "../utility/UUID";
import Logger from "../framework/Logger";
import EntitiesMetaData from '../models/entityMetaData/EntitiesMetaData';

@Service("entitySyncStatusService")
class EntitySyncStatusService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.setup(EntitiesMetaData.referenceEntityTypes);
    }

    getSchema() {
        return EntitySyncStatus.schema.name;
    }

    get(entityName) {
        const all = this.db.objects(EntitySyncStatus.schema.name);
        const expression = `entityName = \"${entityName}\"`;
        const entitySyncStatuses = all.filtered(expression).slice(0, 1);
        if (_.isNil(entitySyncStatuses) || entitySyncStatuses.length === 0) return undefined;
        return entitySyncStatuses[0];
    }

    setup(entityMetaDataModel) {
        const self = this;

        entityMetaDataModel.forEach(function(entity) {
            if (_.isNil(self.get(entity.entityName))) {
                try {
                    const entitySyncStatus = EntitySyncStatus.create(entity.entityName, EntitySyncStatus.REALLY_OLD_DATE, UUID.generate());
                    self.save(entitySyncStatus);
                } catch (e) {
                    Logger.logError('EntitySyncStatusService', `${entity.entityName} failed`);
                    throw e;
                }
            }
        });
    }

    save(entitySyncStatus) {
        super.save(EntitySyncStatus)(entitySyncStatus);
    }
}

export default EntitySyncStatusService;