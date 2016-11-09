class District {
    static schema = {
        name: 'District',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            facilities: {type: 'list', objectType: 'Facility'}
        }
    }
}


export default District;