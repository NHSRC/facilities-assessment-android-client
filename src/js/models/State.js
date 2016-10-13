class State {
    static schema = {
        name: 'State',
        primaryKey: 'name',
        properties: {
            name: 'string',
            districts: {type: 'list', objectType: 'District'}
        }
    }
}


export default State;