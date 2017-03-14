class StandardProgress {
    static schema = {
        name: 'StandardProgress',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            standard: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    }
}

export default StandardProgress;