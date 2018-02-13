import UUID from "../utility/UUID";
import _ from "lodash";
import moment from "moment";

class FacilityAssessment {
    static schema = {
        name: 'FacilityAssessment',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            syncedUuid: {type: 'string', optional: true},
            facility: 'string',
            assessmentTool: 'string',
            assessmentType: 'string',
            startDate: {type: 'date', default: new Date()},
            endDate: {type: 'date', optional: true},
            dateUpdated: {type: 'date', default: new Date()},
            submitted: {type: 'bool', default: false},
            seriesName: {type: 'string', optional: true},
            deviceId: {type: 'string', optional: true}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        obj.dateUpdated = new Date();
        return obj;
    }

    static generateSeries() {
        return moment().format('YYYYMMDD');
    }
}


export default FacilityAssessment;