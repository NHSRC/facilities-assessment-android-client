import _ from "lodash";
import UUID from '../utility/UUID';

class StandardProgress {
    static schema = {
        name: 'StandardProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            standard: 'string',
            areaOfConcern: 'string',
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

export default StandardProgress;