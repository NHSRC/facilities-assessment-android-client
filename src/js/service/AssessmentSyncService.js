import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import {post} from "../framework/http/requests";
import BatchRequest from "../framework/http/BatchRequest";
import ChecklistService from "./ChecklistService";
import checkpointScoreMapper from "../mapper/checkpointScoreMapper";
import FacilityAssessmentService from "./FacilityAssessmentService";
import SettingsService from "./SettingsService";
import Logger from "../framework/Logger";
import EntityService from "./EntityService";
import FacilitiesService from "./FacilitiesService";
import EnvironmentConfig from "../views/common/EnvironmentConfig";
import IndicatorService from "./IndicatorService";
import Indicator from "../models/Indicator";
import AssessmentTool from "../models/AssessmentTool";
import _ from 'lodash';
import FacilityAssessmentMapper from "../mapper/FacilityAssessmentMapper";

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
            const facilityAssessmentService = this.getService(FacilityAssessmentService);
            facilityAssessmentService.addSyncedUuid({
                uuid: originalAssessment.uuid,
                syncedUuid: facilityAssessment.uuid
            });

            const checklistService = this.getService(ChecklistService);
            const facilitiesService = this.getService(FacilitiesService);
            const state = facilitiesService.getStateForFacility(facilityUUID);
            const batchRequest = new BatchRequest();
            const checklists = checklistService.getChecklistsFor(facilityAssessment.assessmentTool, state);
            checklists.map(({uuid, name, department}) =>
                _.assignIn({
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
                    errorHandler(error);
                });
        }
    }

    syncIndicators(originalAssessment, cb, errorHandler) {
        return (facilityAssessment) => {
            const facilityAssessmentService = this.getService(FacilityAssessmentService);
            facilityAssessmentService.addSyncedUuid({
                uuid: originalAssessment.uuid,
                syncedUuid: facilityAssessment.uuid
            });

            const batchRequest = new BatchRequest();
            let indicatorList = {facilityAssessment: facilityAssessment.uuid};
            let indicators = this.getService(IndicatorService).getIndicators(facilityAssessment.uuid);
            indicatorList.indicators = indicators.map((indicator) => Indicator.createDTO(indicator));
            Logger.logDebug('AssessmentSyncService.syncIndicators', indicatorList);
            batchRequest.post(`${this.serverURL}/api/facility-assessment/indicator`, indicatorList, () => {}, () => {});
            batchRequest.fire((final) => {
                    facilityAssessmentService.markSubmitted(originalAssessment);
                    cb();
                },
                (error) => {
                    Logger.logError('AssessmentSyncService', JSON.stringify(error));
                    errorHandler(error);
                });
        }
    }

    syncFacilityAssessment(assessment, cb, errorHandler) {
        let entityService = this.getService(EntityService);
        let facilitiesService = this.getService(FacilitiesService);

        let district = facilitiesService.getDistrictForFacility(assessment.facility.uuid);
        let state = facilitiesService.getStateForDistrict(district.uuid);
        let facilityAssessmentDTO = FacilityAssessmentMapper.toResource(assessment, state.uuid, district.uuid);
        let assessmentTool = entityService.findByUUID(assessment.assessmentTool.uuid, AssessmentTool.schema.name);

        let syncChecklist = this.syncChecklists(assessment, facilityAssessmentDTO.facility, cb, errorHandler);
        let syncIndicator = this.syncIndicators(assessment, cb, errorHandler);

        Logger.logDebug('AssessmentSyncService.syncFacilityAssessment', assessmentTool.assessmentToolType);
        let sync = assessmentTool.assessmentToolType === AssessmentTool.INDICATOR ? syncIndicator : syncChecklist;

        this.serverURL = this.getService(SettingsService).getServerURL();
        console.log(facilityAssessmentDTO);
        post(`${this.serverURL}/api/facility-assessment`, facilityAssessmentDTO, sync, errorHandler);
    }
}

export default AssessmentSyncService;