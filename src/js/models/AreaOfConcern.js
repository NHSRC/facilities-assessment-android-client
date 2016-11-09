class AreaOfConcern {
    static schema = {
        name: 'AreaOfConcern',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            standards: {type: 'list', objectType: 'Standard'}
        }
    }
}


export default AreaOfConcern;