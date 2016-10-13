class Facility {
    static schema = {
        name: 'Facility',
        primaryKey: 'name',
        properties: {
            name: 'string',
            facilityType: 'FacilityType'
        }
    }
}


export default Facility;