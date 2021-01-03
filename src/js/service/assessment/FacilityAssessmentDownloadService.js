import Service from "../../framework/bean/Service";
import BaseService from "../../service/BaseService";
import EntityService from "../../service/EntityService";
import AssessmentCustomInfo from "../../models/assessment/AssessmentCustomInfo";
import AssessmentMetaData from "../../models/assessment/AssessmentMetaData";

@Service("facilityAssessmentDownloadService")
export default class FacilityAssessmentDownloadService extends BaseService {
    saveWithinTx(entityClass, entity) {
        let entityService = this.getService(EntityService);
        entity.customInfos = entity.customInfos.map((x) => {
            let assessmentCustomInfo = new AssessmentCustomInfo();
            assessmentCustomInfo.valueString = x.valueString;
            assessmentCustomInfo.assessmentMetaData = entityService.findByUUID(x["assessmentMetaDataUuid"], AssessmentMetaData.schema.name);
            assessmentCustomInfo.facilityAssessment = entity;
        });
        return super.saveWithinTx(entityClass, entity);
    }
}