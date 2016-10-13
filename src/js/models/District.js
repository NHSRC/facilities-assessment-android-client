class District {
    static schema = {
        name: 'District',
        primaryKey: 'name',
        properties: {
            name: 'string',
            facilities: {type: 'list', objectType: 'Facility'}
        }
    }
}


export default District;