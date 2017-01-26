import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import AssessmentTool from "../models/AssessmentTool";
import AssessmentType from "../models/AssessmentType";
import FacilityAssessment from "../models/FacilityAssessment";

@Service("facilityAssessmentService")
class FacilityAssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessment = this.save(FacilityAssessment, FacilityAssessment.toDB);
    }

    getAssessmentTools() {
        return this.db.objects(AssessmentTool.schema.name).map(this.nameAndId);
    }

    getAssessmentTypes() {
        return this.db.objects(AssessmentType.schema.name).map(this.nameAndId);
    }

    getExistingAssessment(facility, assessmentTool, assessmentType) {
        return Object.assign({}, this.db.objects(FacilityAssessment.schema.name)
            .filtered('facility = $0 AND assessmentTool = $1 AND assessmentType = $2 AND endDate = null',
                facility.uuid, assessmentTool.uuid, assessmentType.uuid)[0]);
    }

    startAssessment(facility, assessmentTool, assessmentType) {
        const existingAssessment = this.getExistingAssessment(facility, assessmentTool, assessmentType);
        return this.saveAssessment(Object.assign(existingAssessment, {
            assessmentTool: assessmentTool.uuid,
            facility: facility.uuid,
            assessmentType: assessmentType.uuid
        }));
    }

    endAssessment(facilityAssessment) {
        const existingAssessment = Object.assign({}, this.db.objectForPrimaryKey(FacilityAssessment.schema.name, facilityAssessment.uuid));
        return this.saveAssessment(Object.assign(existingAssessment, {
            endDate: new Date()
        }));
    }
}

export default FacilityAssessmentService;