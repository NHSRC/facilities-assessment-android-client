class AssessmentLocation {
    static schema = {
        name: 'AssessmentLocation',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            facilityAssessment: 'string',
            checklist: 'string'
        }
    };
}

export default AssessmentLocation;