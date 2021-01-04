import Service from "../../framework/bean/Service";
import BaseService from "../BaseService";
import AssessmentMetaData from "../../models/assessment/AssessmentMetaData";

@Service("assessmentMetaDataService")
class AssessmentMetaDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    get schemaName() {
        return AssessmentMetaData.schema.name;
    }

    getAll() {
        let list = this.findAll(AssessmentMetaData);
        if (list.length === 0) {
            list = [AssessmentMetaData.createForAssessorName()];
        }
        return list;
    }
}

export default AssessmentMetaDataService;