import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import Logger from "../framework/Logger";
import EntitySyncStatusService from "./EntitySyncStatusService";
import ReferenceDataSyncService from "./ReferenceDataSyncService";
import LocalReferenceDataSyncService from "./LocalReferenceDataSyncService";
import PackagedJSON from "./PackagedJSON";
import SeedProgress from "../models/SeedProgress";
import _ from 'lodash';
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import FacilityAssessmentService from "./FacilityAssessmentService";
import AssessmentTool from "../models/AssessmentTool";
import AssessmentType from "../models/AssessmentType";
import FacilitiesService from "./FacilitiesService";
import StateService from "./StateService";
import EntityService from "./EntityService";
import ChecklistService from "./ChecklistService";
import AreaOfConcernProgress from "../models/AreaOfConcernProgress";
import StandardProgress from "../models/StandardProgress";
import ChecklistProgress from "../models/ChecklistProgress";

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.SEED_PROGRESS_UUID = SeedProgress.UUID;
    }

    postInit() {
        if (this.isNotCompletelySeeded() && EnvironmentConfig.shouldUsePackagedSeedData) {
            this.deleteAllData();
            let localReferenceDataSyncService = new LocalReferenceDataSyncService(this.db, this.beanStore, this.getService(ReferenceDataSyncService));
            localReferenceDataSyncService.syncMetaDataFromLocal(PackagedJSON.getFiles(), this.finishSeeding.bind(this));
        }
    }

    startSeedProgress() {
        return this.save(SeedProgress)({uuid: this.SEED_PROGRESS_UUID, started: true});
    }

    finishSeeding() {
        return this.save(SeedProgress)({
            uuid: this.SEED_PROGRESS_UUID,
            started: true,
            finished: true
        });
    }

    getSeedProgress() {
        return {...this.db.objectForPrimaryKey(SeedProgress.schema.name, this.SEED_PROGRESS_UUID)};
    }

    isNotCompletelySeeded() {
        let seedProgress = this.getSeedProgress();
        if (_.isEmpty(seedProgress)) {
            seedProgress = this.startSeedProgress();
        }
        return !seedProgress.finished;
    }

    deleteAllData() {
        this._deleteData(EntitiesMetaData.allEntityTypes);
        this.deleteProgressData();
        this.deleteSeedProgress();
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