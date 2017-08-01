class Checklist {
    static schema = {
        name: 'Checklist',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            department: 'string',
            assessmentTool: 'string',
            state: {type: 'string', default: null},
            areasOfConcern: {type: 'list', objectType: 'StringObj'}
        }
    }
}

export default Checklist;