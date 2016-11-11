import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Department from "../models/Department";
import AreaOfConcern from "../models/AreaOfConcern";
import Standard from "../models/Standard";
import AssessmentType from "../models/AssessmentType";

@Service("assessmentService")
class AssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAssessmentType = this.save(AssessmentType);
        this.saveAreaOfConcern = this.save(AreaOfConcern);
        this.getAreaOfConcern = this.getAreaOfConcern.bind(this);
    }

    getAssessmentTypes() {
        return this.db.objects(AssessmentType.schema.name).map(this.nameAndId);
    }

    getAreaOfConcern(aocUUID) {
        return this.db.objectForPrimaryKey(AreaOfConcern.schema.name, aocUUID);
    }
}

export default AssessmentService;