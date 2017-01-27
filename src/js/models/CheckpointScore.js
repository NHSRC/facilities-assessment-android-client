import UUID from '../utility/UUID';
import _ from 'lodash';

class CheckpointScore {
    static schema = {
        name: 'CheckpointScore',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            areaOfConcern: 'string',
            standard: 'string',
            checkpoint: 'string',
            score: {type: 'int', default: 0},
            remarks: {type: 'string', optional: true},
            dateUpdated: {type: 'date', default: new Date()}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        obj.dateUpdated = new Date();
        return obj;
    }

    static create(checkpoint, standard, areaOfConcern, checklist, facilityAssessment, existingCheckpoint) {
        return Object.assign({
            uuid: UUID.generate(),
            facilityAssessment: facilityAssessment.uuid,
            checklist: checklist.uuid,
            areaOfConcern: areaOfConcern.uuid,
            standard: standard.uuid,
            checkpoint: checkpoint,
            score: undefined,
            remarks: undefined,
            dateUpdated: undefined,
        }, existingCheckpoint, {checkpoint: checkpoint});
    }
}


export default CheckpointScore;