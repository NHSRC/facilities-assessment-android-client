import UUID from '../utility/UUID';
import _ from 'lodash';

class Assessment {
    static schema = {
        name: 'Assessment',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            facility: 'string',
            checklist: 'string',
            assessmentTool: 'string',
            assessmentType: 'string',
            startDate: {type: 'date', default: new Date()},
            endDate: {type: 'date', optional: true}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        return obj;
    }
}


export default Assessment;