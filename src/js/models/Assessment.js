import UUID from '../utility/UUID';

class Assessment {
    static schema = {
        name: 'Assessment',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            facility: 'string',
            checklist: 'string',
            assessmentType: 'string',
            startDate: {type: 'date', default: new Date()},
            endDate: {type: 'date', optional: true}
        }
    };

    static toDB(obj) {
        obj.uuid = UUID.generate();
        return obj;
    }
}


export default Assessment;