import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import _ from "lodash";
import UUID from "../utility/UUID";
import Logger from "../framework/Logger";
import EntitiesMetaData from '../models/entityMetaData/EntitiesMetaData';
import EntityMetaData from "../models/entityMetaData/EntityMetaData";
import FacilityType from "../models/FacilityType";

@Service("entitySyncStatusService")
class EntitySyncStatusService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    getSchema() {
        return EntitySyncStatus.schema.name;
    }

    init() {
        this.setup(EntitiesMetaData.referenceEntityTypes);
    }

    get(entityName) {
        const all = this.db.objects(EntitySyncStatus.schema.name);
        const expression = `entityName = \"${entityName}\"`;
        const entitySyncStatuses = all.filtered(expression).slice(0, 1);
        if (_.isNil(entitySyncStatuses) || entitySyncStatuses.length === 0) return undefined;
        return entitySyncStatuses[0];
    }

    setup(entitiesMetaData) {
        const self = this;
        entitiesMetaData.forEach((entityMetaData) => {
            if (_.isNil(self.get(entityMetaData.entityName))) {
                try {
                    const entitySyncStatus = EntitySyncStatus.create(entityMetaData.entityName, EntitySyncStatus.REALLY_OLD_DATE, UUID.generate());
                    self.save(EntitySyncStatus)(entitySyncStatus);
                } catch (e) {
                    Logger.logError('EntitySyncStatusService', `${entityMetaData.entityName} failed`);
                    throw e;
                }
            }
        });
    }
}

export default EntitySyncStatusService;