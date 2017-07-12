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

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.create = this.create.bind(this);
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
        if (this.isNotSeeded() && Config.USE_PACKAGED_SEED_DATA === "true") {
            let localReferenceDataSyncService = new LocalReferenceDataSyncService(this.db, this.beanStore, this.getService(ReferenceDataSyncService));
            localReferenceDataSyncService.syncMetaDataFromLocal(PackagedJSON.getFiles());
        }
    }

    isNotSeeded() {
        let allStates = this.getService(StateService).getAllStates();
        return allStates.length === 0;
    }

    createAll() {
        [
            {
                "service": SettingsService,
                "method": "saveSettings",
                "entity": settings
            },
            {
                "service": FacilitiesService,
                "method": "saveFacilityType",
                "entity": facilityTypes
            },
            {
                "service": StateService,
                "method": "saveState",
                "entity": states
            },
            {
                "service": ChecklistAssessmentService,
                "method": "saveAssessmentTool",
                "entity": assessmentTools
            },
            {
                "service": DepartmentService,
                "method": "saveDepartment",
                "entity": departments
            },
            {
                "service": ChecklistAssessmentService,
                "method": "saveAreaOfConcern",
                "entity": areasOfConcern
            },
            {
                "service": ChecklistService,
                "method": "saveChecklist",
                "entity": checklists
            },
            {
                "service": ChecklistService,
                "method": "saveCheckpoint",
                "entity": checkpoints
            },
            {
                "service": ChecklistAssessmentService,
                "method": "saveAssessmentType",
                "entity": assessmentTypes
            }
        ].map(this.create);
    }

    create(seedEntity) {
        let serviceInstance = this.getService(seedEntity.service);
        return seedEntity.entity.map((e) => serviceInstance[seedEntity.method](e));
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