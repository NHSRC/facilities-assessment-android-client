class AreaOfConcernProgress {
    static schema = {
        name: 'AreaOfConcernProgress',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            areaOfConcern: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    }
}

export default AreaOfConcernProgress;