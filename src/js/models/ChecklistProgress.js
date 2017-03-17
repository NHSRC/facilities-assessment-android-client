import _ from 'lodash';
import UUID from '../utility/UUID';

class ChecklistProgress {
    static schema = {
        name: 'ChecklistProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        return obj;
    };
}

export default ChecklistProgress;