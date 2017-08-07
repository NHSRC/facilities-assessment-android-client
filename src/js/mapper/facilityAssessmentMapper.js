import {formatDate} from '../utility/DateUtils';

export default facilityAssessmentMapper =
    ({uuid, facility: {uuid: facilityUUID}, assessmentTool: {uuid: assessmentToolUUID}, startDate, endDate, seriesName}) =>
        Object.assign({
            uuid: uuid,
            facility: facilityUUID,
            assessmentTool: assessmentToolUUID,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            seriesName: seriesName
        });