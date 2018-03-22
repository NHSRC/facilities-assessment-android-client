import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import Logger from "../framework/Logger";
import EntitySyncStatusService from "./EntitySyncStatusService";
import LocalReferenceDataSyncService from "./LocalReferenceDataSyncService";
import SeedProgress from "../models/SeedProgress";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import AreaOfConcernProgress from "../models/AreaOfConcernProgress";
import StandardProgress from "../models/StandardProgress";
import ChecklistProgress from "../models/ChecklistProgress";
import SeedProgressService from "./SeedProgressService";
import _ from 'lodash';
import StringObj from "../models/StringObj";
import SettingsService from "./SettingsService";

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    postInit() {
        if (EnvironmentConfig.shouldUsePackagedSeedData) {
            let seedProgressService = this.getService(SeedProgressService);
            let checklistLoaded = seedProgressService.isChecklistLoaded();
            if (!checklistLoaded || seedProgressService.versionChanged()) {
                let localReferenceDataSyncService = this.getService(LocalReferenceDataSyncService);
                if (SeedProgress.isDefaultVersion(seedProgressService.getSeedProgress()))
                    this.getService(SettingsService).setupStatesAlreadyLoaded();
                localReferenceDataSyncService.syncMetaDataFromLocal(seedProgressService.finishedLoadingChecklist.bind(seedProgressService));
            }
        }
    }

    deleteAllData() {
        this._deleteData(EntitiesMetaData.allEntityTypes);
        this.deleteProgressData();
        this.deleteSeedProgress();
        this.deleteStringObjects();
    }

    deleteTxData() {
        this._deleteData(EntitiesMetaData.txEntityTypes);
        this.deleteProgressData();
    }

    deleteSeedProgress() {
        const db = this.db;
        db.write(() => {
            db.delete(db.objects(SeedProgress.schema.name));
        });
    }

    deleteStringObjects() {
        const db = this.db;
        db.write(() => {
            db.delete(db.objects(StringObj.schema.name));
        });
    }

    deleteProgressData() {
        const entityTypesToDelete = [AreaOfConcernProgress, StandardProgress, ChecklistProgress];
        const db = this.db;
        db.write(() => {
            entityTypesToDelete.forEach((entityType) => {
                Logger.logDebug('SeedDataService', `Deleting all data for ${entityType.schema.name}`);
                let allEntities = db.objects(entityType.schema.name);
                db.delete(allEntities);
            });
        });
    }

    _deleteData(entitiesToDelete) {
        const db = this.db;
        let entitySyncStatusService = this.getService(EntitySyncStatusService);

        db.write(() => {
            entitiesToDelete.forEach((entityMetaData) => {
                entitySyncStatusService.deleteEntitySyncStatusFor(entityMetaData.entityName);
            });
        });

        entitiesToDelete.forEach((entityMetaData) => {
            if (entityMetaData.isMappedToDb) {
                Logger.logDebug('SeedDataService', `Deleting all data from ${entityMetaData.entityName}`);
                db.write(() => {
                    const objects = db.objects(entityMetaData.entityName);
                    db.delete(objects);
                });
            } else {
                Logger.logDebug('SeedDataService', `Skipping as not mapped to db - ${entityMetaData.entityName}`);
            }
        });
        entitySyncStatusService.setup(EntitiesMetaData.allEntityTypes);
    }
}

export default SeedDataService;