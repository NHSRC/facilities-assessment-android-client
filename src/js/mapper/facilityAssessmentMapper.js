import {formatDate} from '../utility/DateUtils';
import _ from "lodash";

export default facilityAssessmentMapper =
    ({uuid, facility: {uuid: facilityUUID, name: name}, assessmentTool: {uuid: assessmentToolUUID}, assessmentType: {uuid: assessmentTypeUUID}, startDate, endDate, seriesName, deviceId}, stateUUID, districtUUID) =>
        _.assignIn({
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
            assessmentTypeUUID: assessmentTypeUUID
        });