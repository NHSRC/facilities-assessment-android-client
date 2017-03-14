class ChecklistProgress {
    static schema = {
        name: 'ChecklistProgress',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            total: "int",
            completed: "int",
        }
    }
}

export default ChecklistProgress;