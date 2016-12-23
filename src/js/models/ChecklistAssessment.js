import UUID from '../utility/UUID';
import _ from 'lodash';

class ChecklistAssessment {
    static schema = {
        name: 'ChecklistAssessment',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            dateUpdated: {type: 'date', default: new Date()}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        obj.dateUpdated = new Date();
        return obj;
    }
}


export default ChecklistAssessment;