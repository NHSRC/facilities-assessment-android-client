import UUID from '../utility/UUID';

class CheckpointScore {
    static schema = {
        name: 'CheckpointScore',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            facility: 'string',
            checklist: 'string',
            assessment: 'string',
            checkpoint: 'string',
            score: {type: 'int', default: 0},
            remarks: {type: 'string', optional: true}
        }
    };

    static toDB(obj) {
        obj.uuid = UUID.generate();
        return obj;
    }
}


export default CheckpointScore;