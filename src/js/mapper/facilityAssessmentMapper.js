import _ from "lodash";
import moment from "moment";
import ResourceUtil from "../utility/ResourceUtil";
import AssessmentCustomInfo from "../models/assessment/AssessmentCustomInfo";
import {formatDate} from "../utility/DateUtils";

class FacilityAssessmentMapper {
    fromResource(resource) {
        resource.facility = ResourceUtil.getUUIDFor(resource, "facilityUUID");
        resource.assessmentTool = ResourceUtil.getUUIDFor(resource, "assessmentToolUUID");
        resource.submitted = true;
        resource.startDate = moment(resource.startDate).toDate();
        resource.endDate = moment(resource.endDate).toDate();
        resource.dateUpdated = moment(resource.lastModifiedDate).toDate();
        resource.assessmentType = ResourceUtil.getUUIDFor(resource, "assessmentTypeUUID");
        return resource;
    }

    static toResource({uuid, facility: {uuid: facilityUUID, name: name}, assessmentTool: {uuid: assessmentToolUUID}, assessmentType: {uuid: assessmentTypeUUID}, startDate, endDate, seriesName, deviceId, customInfos}, stateUUID, districtUUID) {
        return _.assignIn({
            uuid: uuid,
            state: stateUUID,
            district: districtUUID,
            facility: facilityUUID,
            facilityName: name,
            assessmentTool: assessmentToolUUID,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            seriesName: seriesName,
            deviceId: deviceId,
            assessmentTypeUUID: assessmentTypeUUID,
            customInfos: customInfos.map((x) => AssessmentCustomInfo.toResource(x))
        })
    }
}

export default FacilityAssessmentMapper;