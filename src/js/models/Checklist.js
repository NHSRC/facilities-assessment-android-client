class Checklist {
    static schema = {
        name: 'Checklist',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            department: 'string',
            assessmentTools: {type: 'list', objectType: 'StringObj'},
            state: {type: 'string', optional: true},
            areasOfConcern: {type: 'list', objectType: 'StringObj'}
        }
    }
}

export default Checklist;