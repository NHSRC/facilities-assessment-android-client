import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import StateService from "./StateService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import Logger from "../framework/Logger";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntityMetaData from "../models/entityMetaData/EntityMetaData";
import EntitySyncStatusService from "./EntitySyncStatusService";
import ReferenceDataSyncService from "./ReferenceDataSyncService";
import LocalReferenceDataSyncService from "./LocalReferenceDataSyncService";
import PackagedJSON from "./PackagedJSON";
import Config from "react-native-config";
import SeedProgress from "../models/SeedProgress";
import _ from 'lodash';

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.SEED_PROGRESS_UUID = "bd223d42-a168-4454-9277-4704db5ab2ad";
    }

    /*var a = function(number) {
     var i = 0;
     var message = "[";
     for (; i <= number; i++) {
     message += `require('../../config/${i}.json'), `;
     }
     message += "];";
     console.log(message);
     };

     a(72);*/

    postInit() {
        if (this.isNotCompletelySeeded() && Config.USE_PACKAGED_SEED_DATA === "true") {
            this.deleteAllData();
            let localReferenceDataSyncService = new LocalReferenceDataSyncService(this.db, this.beanStore, this.getService(ReferenceDataSyncService));
            localReferenceDataSyncService.syncMetaDataFromLocal(PackagedJSON.getFiles(), this.finishSeeding.bind(this));
        }
    }

    startSeedProgress() {
        return this.save(SeedProgress)({uuid: this.SEED_PROGRESS_UUID, started: true});
    }

    updateSeedProgress(fileNumber) {
        return this.save(SeedProgress)({
            uuid: this.SEED_PROGRESS_UUID,
            started: true,
            fileNumber: fileNumber
        });
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
        const db = this.db;
        let entitiesToDelete = EntitiesMetaData.referenceEntityTypes;
        entitiesToDelete.push(new EntityMetaData(EntitySyncStatus));
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
        this.getService(EntitySyncStatusService).setup(EntitiesMetaData.referenceEntityTypes);
    }
}

export default SeedDataService;