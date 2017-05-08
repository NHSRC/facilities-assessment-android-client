import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import states from "../../config/states.json";
import facilityTypes from "../../config/facilityTypes.json";
import departments from "../../config/departments.json";
import assessmentTools from "../../config/assessmentTools.json";
import settings from "../../config/settings.json";
import assessmentTypes from "../../config/assessmentTypes.json";
import checklists from "../../config/checklists.json";
import areasOfConcern from "../../config/areasOfConcern.json";
import checkpoints from "../../config/checkpoints.json";
import FacilitiesService from "./FacilitiesService";
import DepartmentService from "./DepartmentService";
import ChecklistAssessmentService from "./AssessmentService";
import ChecklistService from "./ChecklistService";
import StateService from './StateService'
import SettingsService from "./SettingsService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import Logger from "../framework/Logger";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntityMetaData from "../models/entityMetaData/EntityMetaData";

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.create = this.create.bind(this);
    }

    init() {
        if (this.isNotSeeded()) {
            // this.createAll();
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
    }
}

export default SeedDataService;