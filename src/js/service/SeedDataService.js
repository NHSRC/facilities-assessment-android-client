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

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.SEED_PROGRESS_UUID = SeedProgress.UUID;
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
        if (this.isNotCompletelySeeded() && EnvironmentConfig.shouldUsePackagedSeedData) {
            let localReferenceDataSyncService = new LocalReferenceDataSyncService(this.db, this.beanStore, this.getService(ReferenceDataSyncService));
            localReferenceDataSyncService.syncMetaDataFromLocal(PackagedJSON.getFiles(), this.finishSeeding.bind(this));
        }
        if (EnvironmentConfig.shouldSetupTestData) {
            this.setupTestData();
        }
    }

    setupTestData() {
        const facilityAssessmentService = this.getService(FacilityAssessmentService);
        const checklistService = this.getService(ChecklistService);
        const stateService = this.getService(StateService);
        const facilityService = this.getService(FacilitiesService);
        const entityService = this.getService(EntityService);

        let state = stateService.findByName('Chhattisgarh');
        let facility = state.districts[0].facilities[0];

        let assessmentTool = entityService.findByName('Dakshata', AssessmentTool.schema.name);
        let assessmentType = entityService.findByName('Internal', AssessmentType.schema.name);
        const facilityAssessment = facilityAssessmentService.startAssessment(facility, assessmentTool, assessmentType, '5');

        let checklists = checklistService.getChecklistsFor(assessmentTool, state);
        checklists.forEach((checklist) => {
            checklist.areasOfConcern.forEach((aoc) => {
                // entityService.findByKey(aoc.);
            });
        });

        // facilityAssessmentService.updateStandardProgress(action.standard, action.areaOfConcern, action.checklist, action.facilityAssessment);
        // let updatedProgress = facilityAssessmentService.updateAreaOfConcernProgress(action.areaOfConcern, action.checklist, action.facilityAssessment);
        // let updatedProgress = facilityAssessmentService.updateChecklistProgress(action.checklist, action.facilityAssessment);
        // const savedCheckpoint = facilityAssessmentService.saveCheckpointScore(checkpointToUpdate);
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
        this._deleteData(EntitiesMetaData.allEntityTypes);
    }

    deleteTxData() {
        this._deleteData(EntitiesMetaData.txEntityTypes);
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