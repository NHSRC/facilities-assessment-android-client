class State {
    static schema = {
        name: 'State',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            districts: {type: 'list', objectType: 'District'}
        }
    }
}


export default State;