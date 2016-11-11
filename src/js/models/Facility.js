class Facility {
    static schema = {
        name: 'Facility',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            facilityType: 'string'
        }
    }
}


export default Facility;