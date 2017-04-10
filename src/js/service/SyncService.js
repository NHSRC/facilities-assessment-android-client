import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import {post} from '../framework/http/requests';
import facilityAssessmentMapper from '../mapper/facilityAssessmentMapper'

@Service("syncService")
class SyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
    }

    syncFacilityAssessment(assessment) {
        let facilityAssessmentDTO = facilityAssessmentMapper(assessment);
        post("http://192.168.59.1:8080/api/facility-assessment", facilityAssessmentDTO, (whatevs) => console.log(whatevs));
    }
}

export default SyncService;