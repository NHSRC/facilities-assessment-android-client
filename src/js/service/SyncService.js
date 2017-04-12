import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import {post} from '../framework/http/requests';
import facilityAssessmentMapper from '../mapper/facilityAssessmentMapper'
import BatchRequest from "../framework/http/BatchRequest";
import ChecklistService from "./ChecklistService";
import checkpointScoreMapper from '../mapper/checkpointScoreMapper';
import FacilityAssessmentService from './FacilityAssessmentService';
import appConfig from '../../config/app.config.json';

@Service("syncService")
class SyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.syncChecklists = this.syncChecklists.bind(this);
    }

    init() {
    }


    syncChecklists(facilityAssessment) {
        const checklistService = this.getService(ChecklistService);
        const facilityAssessmentService = this.getService(FacilityAssessmentService);
        const batchRequest = new BatchRequest();
        const checklists = checklistService.getChecklistsFor(facilityAssessment.assessmentTool);
        checklists.map(({uuid, name, department, assessmentTool}) =>
            Object.assign({
                uuid: uuid,
                name: name,
                department: department.uuid,
                facilityAssessment: facilityAssessment.uuid,
                checkpointScores: checklistService
                    .getCheckpointScoresFor(uuid, facilityAssessment.uuid)
                    .map(checkpointScoreMapper)
            }))
            .map((checklist) =>
                batchRequest.post(`${appConfig.serverURL}/api/facility-assessment/checklist`,
                    checklist,
                    checklistService.markCheckpointScoresSubmitted));
        batchRequest.fire((final) => facilityAssessmentService.markSubmitted(facilityAssessment),
            (error) => console.log("Failed"));
    }

    syncFacilityAssessment(assessment) {
        let facilityAssessmentDTO = facilityAssessmentMapper(assessment);
        post(`${appConfig.serverURL}/api/facility-assessment`, facilityAssessmentDTO, this.syncChecklists);
    }
}

export default SyncService;