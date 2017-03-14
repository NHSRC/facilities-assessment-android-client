class StandardProgress {
    static schema = {
        name: 'StandardProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            standard: 'string',
            areaOfConcern: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    }
}

export default StandardProgress;