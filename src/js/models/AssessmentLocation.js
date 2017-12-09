class AssessmentLocation {
    static schema = {
        name: 'AssessmentLocation',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            facilityAssessment: 'string',
            checklist: 'string',
            accuracy: 'int',
            longitude: 'double',
            latitude: 'double',
            altitude: 'double'
        }
    };
}

export default AssessmentLocation;