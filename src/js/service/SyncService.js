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
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";

@Service("syncService")
class SyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.syncChecklists = this.syncChecklists.bind(this);
    }

    init() {
        this.entitySyncStatusService = this.getService(EntitySyncStatusService);
        this.conventionalRestClient = new ConventionalRestClient(this.getService(SettingsService));
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
                    facilityAssessment: facilityAssessment.uuid,
                    checkpointScores: checklistService
                        .getCheckpointScoresFor(uuid, originalAssessment.uuid)
                        .map(checkpointScoreMapper)
                }))
                .map((checklist) => batchRequest.post(`${this.serverURL}/api/facility-assessment/checklist`,
                    checklist,
                    checklistService.markCheckpointScoresSubmitted,
                    () => {
                    }));
            batchRequest.fire((final) => {
                    facilityAssessmentService.markSubmitted(originalAssessment);
                    cb();
                },
                (error) => {
                    cb();
                });
        }
    }

    syncFacilityAssessment(assessment, cb) {
        this.serverURL = this.getService(SettingsService).getServerURL();
        let facilityAssessmentDTO = facilityAssessmentMapper(assessment);
        console.log(JSON.stringify(facilityAssessmentDTO));
        post(`${this.serverURL}/api/facility-assessment`, facilityAssessmentDTO,
            this.syncChecklists(assessment, cb), cb);
    }

    syncMetaData(cb) {
        this.pullData(EntitiesMetaData.referenceEntityTypes, () => {
            Logger.logInfo('SyncService', 'Sync completed!')
        }, (error) => {
            Logger.logError('SyncService', error);
        });
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
            this.getService(entityMetaData.serviceClass).save(entity);
            if (!_.isNil(entityMetaData.parentClass)) {
                const parentEntity = entityMetaData.parentClass.associateChild(entity, entityMetaData.entityClass, resource, this);
                this.save(entityMetaData.parentClass)(parentEntity);
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