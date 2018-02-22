import {formatDate} from '../utility/DateUtils';

export default facilityAssessmentMapper =
    ({uuid, facility: {uuid: facilityUUID, name: name}, assessmentTool: {uuid: assessmentToolUUID}, assessmentType: {uuid: assessmentTypeUUID}, startDate, endDate, seriesName, deviceId}) =>
        Object.assign({
            uuid: uuid,
            facility: facilityUUID,
            facilityName: name,
            assessmentTool: assessmentToolUUID,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            seriesName: seriesName,
            deviceId: deviceId,
            assessmentTypeUUID: assessmentTypeUUID
        });