class Facility {
    static schema = {
        name: 'Facility',
        primaryKey: 'name',
        properties: {
            name: 'string',
            facilityType: 'FacilityType',
            assessmentType: {type: 'list', objectType: 'AssessmentType'},
            departments: {type: 'list', objectType: 'Department'}
        }
    }
}


export default Facility;