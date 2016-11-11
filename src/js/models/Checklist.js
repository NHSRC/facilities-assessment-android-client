class Checklist {
    static schema = {
        name: 'Checklist',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            department: 'string',
            assessmentType: 'string',
            areasOfConcern: {type: 'list', objectType: 'StringObj'}
        }
    }
}

export default Checklist;