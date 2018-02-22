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
import EntityService from "./EntityService";
import moment from "moment";
import FacilitiesService from "./FacilitiesService";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

@Service("assessmentSyncService")
class AssessmentSyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.syncChecklists = this.syncChecklists.bind(this);
    }

    init() {
        this.serverURL = EnvironmentConfig.serverURL;
    }

    syncChecklists(originalAssessment, facilityUUID, cb, errorHandler) {
        return (facilityAssessment) => {
            const checklistService = this.getService(ChecklistService);
            const facilitiesService = this.getService(FacilitiesService);
            const state = facilitiesService.getStateForFacility(facilityUUID);
            const facilityAssessmentService = this.getService(FacilityAssessmentService);
            facilityAssessmentService.addSyncedUuid({
                uuid: originalAssessment.uuid,
                syncedUuid: facilityAssessment.uuid
            });
            const batchRequest = new BatchRequest();
            const checklists = checklistService.getChecklistsFor(facilityAssessment.assessmentTool, state);
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
                    checklistService.markCheckpointScoresSubmitted, () => {
                    }));
            batchRequest.fire((final) => {
                    facilityAssessmentService.markSubmitted(originalAssessment);
                    cb();
                },
                (error) => {
                    Logger.logError('AssessmentSyncService', JSON.stringify(error));
                    errorHandler();
                });
        }
    }

    syncFacilityAssessment(assessment, cb, errorHandler) {
        this.serverURL = this.getService(SettingsService).getServerURL();
        let facilityAssessmentDTO = facilityAssessmentMapper(assessment);
        post(`${this.serverURL}/api/facility-assessment`, facilityAssessmentDTO,
            this.syncChecklists(assessment, facilityAssessmentDTO.facility, cb, errorHandler), errorHandler);
    }
}

export default AssessmentSyncService;