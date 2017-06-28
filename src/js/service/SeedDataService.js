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

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.create = this.create.bind(this);
    }


    postInit() {
        if (this.isNotSeeded()) {
            const files = [require('../../config/0.json'), require('../../config/1.json'), require('../../config/2.json'), require('../../config/3.json'), require('../../config/4.json'), require('../../config/5.json'), require('../../config/6.json'), require('../../config/7.json'), require('../../config/8.json'), require('../../config/9.json'), require('../../config/10.json'), require('../../config/11.json'), require('../../config/12.json'), require('../../config/13.json'), require('../../config/14.json'), require('../../config/15.json'), require('../../config/16.json'), require('../../config/17.json'), require('../../config/18.json'), require('../../config/19.json'), require('../../config/20.json'), require('../../config/21.json'), require('../../config/22.json'), require('../../config/23.json'), require('../../config/24.json'), require('../../config/25.json'), require('../../config/26.json'), require('../../config/27.json'), require('../../config/28.json'), require('../../config/29.json'), require('../../config/30.json'), require('../../config/31.json'), require('../../config/32.json'), require('../../config/33.json'), require('../../config/34.json'), require('../../config/35.json'), require('../../config/36.json'), require('../../config/37.json'), require('../../config/38.json'), require('../../config/39.json'), require('../../config/40.json'), require('../../config/41.json'), require('../../config/42.json'), require('../../config/43.json'), require('../../config/44.json'), require('../../config/45.json'), require('../../config/46.json'), require('../../config/47.json'), require('../../config/48.json'), require('../../config/49.json'), require('../../config/50.json'), require('../../config/51.json'), require('../../config/52.json'), require('../../config/53.json'), require('../../config/54.json'), require('../../config/55.json'), require('../../config/56.json'), require('../../config/57.json'), require('../../config/58.json'), require('../../config/59.json'), require('../../config/60.json'), require('../../config/61.json'), require('../../config/62.json'), require('../../config/63.json'), require('../../config/64.json')];

            let localReferenceDataSyncService = new LocalReferenceDataSyncService(this.db, this.beanStore, this.getService(ReferenceDataSyncService));
            localReferenceDataSyncService.syncMetaDataFromLocal(files);
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