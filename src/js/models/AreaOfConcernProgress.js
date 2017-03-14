class AreaOfConcernProgress {
    static schema = {
        name: 'AreaOfConcernProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            areaOfConcern: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    }
}

export default AreaOfConcernProgress;