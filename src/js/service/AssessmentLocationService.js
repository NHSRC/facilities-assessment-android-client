import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import AssessmentLocation from "../models/AssessmentLocation";
import _ from "lodash";

@Service("AssessmentLocationService")
class AssessmentLocationService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    saveLocation(assessmentLocation) {
        let existingAssessmentLocation = this.findByCriteria(`facilityAssessment="${assessmentLocation.facilityAssessment}" and checklist=="${assessmentLocation.checklist}"`, AssessmentLocation);
        if (_.isNil(existingAssessmentLocation))
            this.save(AssessmentLocation)(assessmentLocation);
    }
}

export default AssessmentLocationService;