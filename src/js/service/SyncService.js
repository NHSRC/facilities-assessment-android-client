import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import {post} from "../framework/http/requests";
import facilityAssessmentMapper from "../mapper/facilityAssessmentMapper";
import BatchRequest from "../framework/http/BatchRequest";
import ChecklistService from "./ChecklistService";
import checkpointScoreMapper from "../mapper/checkpointScoreMapper";
import FacilityAssessmentService from "./FacilityAssessmentService";
import SettingsService from "./SettingsService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import Logger from "../framework/Logger";

@Service("syncService")
class SyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.syncChecklists = this.syncChecklists.bind(this);
        this.baseService = this.getService(BaseService);
        this.entitySyncStatusService = this.getService(EntitySyncStatusService);
        this.conventionalRestClient = new ConventionalRestClient(this.getService(SettingsService));
    }

    init() {
        this.serverURL = this.getService(SettingsService).getServerURL();
    }

    syncChecklists(originalAssessment, cb) {
        return (facilityAssessment) => {
            const checklistService = this.getService(ChecklistService);
            const facilityAssessmentService = this.getService(FacilityAssessmentService);
            facilityAssessmentService.addSyncedUuid({
                uuid: originalAssessment.uuid,
                syncedUuid: facilityAssessment.uuid
            });
            const batchRequest = new BatchRequest();
            const checklists = checklistService.getChecklistsFor(facilityAssessment.assessmentTool);
            checklists.map(({uuid, name, department, assessmentTool}) =>
                Object.assign({
                    uuid: uuid,
                    name: name,
                    department: department.uuid,
                    facilityAssessment: originalAssessment.uuid,
                    checkpointScores: checklistService
                        .getCheckpointScoresFor(uuid, originalAssessment.uuid)
                        .map(checkpointScoreMapper)
                }))
                .map((checklist) =>
                    batchRequest.post(`${this.serverURL}/api/facility-assessment/checklist`,
                        checklist,
                        checklistService.markCheckpointScoresSubmitted));
            batchRequest.fire((final) => {
                    facilityAssessmentService.markSubmitted(originalAssessment);
                    cb();
                },
                (error) => console.log("Failed"));
        }
    }

    syncFacilityAssessment(assessment, cb) {
        let facilityAssessmentDTO = facilityAssessmentMapper(assessment);
        post(`${this.serverURL}/api/facility-assessment`, facilityAssessmentDTO,
            this.syncChecklists(assessment, cb));
    }

    syncMetaData(cb) {
        console.log("Syncing MEta Data");
        setTimeout(cb, 2000);
    }

    pullData(unprocessedEntityMetaData, onComplete, onError) {
        const entityMetaData = unprocessedEntityMetaData.pop();
        if (_.isNil(entityMetaData)) {
            onComplete();
            return;
        }

        const entitySyncStatus = this.entitySyncStatusService.get(entityMetaData.entityName);
        Logger.logInfo('SyncService', `${entitySyncStatus.entityName} was last loaded up to "${entitySyncStatus.loadedSince}"`);
        this.conventionalRestClient.loadData(entityMetaData, entitySyncStatus.loadedSince, 0,
            unprocessedEntityMetaData,
            (resourcesWithSameTimeStamp, entityModel) => this.persist(resourcesWithSameTimeStamp, entityModel),
            (workingAllEntitiesMetaData) => this.pullData(workingAllEntitiesMetaData, onComplete, onError),
            [], onError);
    }

    persist(resourcesWithSameTimeStamp, entityMetaData) {
        resourcesWithSameTimeStamp.forEach((resource) => {
            const entity = entityMetaData.mapFromResource(resource);
            this.baseService.save(entityMetaData.entityClass)(entity);
            if (!_.isNil(entityMetaData.parentClass)) {
                const parentEntity = entityMetaData.parentClass.associateChild(entity, entityMetaData.entityClass, resource, this.baseService);
                this.baseService.save(entityMetaData.parentClass)(parentEntity);
            }
        });

        const currentEntitySyncStatus = this.entitySyncStatusService.get(entityMetaData.entityName);
        const entitySyncStatus = new EntitySyncStatus();
        entitySyncStatus.name = entityMetaData.entityName;
        entitySyncStatus.uuid = currentEntitySyncStatus.uuid;
        entitySyncStatus.loadedSince = new Date(resourcesWithSameTimeStamp[0]["lastModifiedDateTime"]);
        this.entitySyncStatusService.save(entitySyncStatus);
    }
}

export default SyncService;