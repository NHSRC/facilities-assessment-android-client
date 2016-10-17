class ReferenceAreaOfConcern {
    static schema = {
        name: 'ReferenceAreaOfConcern',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
            reference: 'string',
            standards: {type: 'list', objectType: 'ReferenceStandard'}
        }
    }
}


export default ReferenceAreaOfConcern;