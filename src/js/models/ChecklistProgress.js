class ChecklistProgress {
    static schema = {
        name: 'ChecklistProgress',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    }
}

export default ChecklistProgress;