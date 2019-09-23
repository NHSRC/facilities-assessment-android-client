class Facility {
    static schema = {
        name: 'Facility',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            facilityType: 'string',
            inactive: {type: "bool", default: false}
        }
    }
}


export default Facility;