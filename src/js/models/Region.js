class Region {
    static schema = {
        name: 'Region',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            states: {type: 'list', objectType: 'State'}
        }
    }
}


export default Region;