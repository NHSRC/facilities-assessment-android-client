class Standard {
    static schema = {
        name: 'Standard',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            measurableElements: {type: 'list', objectType: 'MeasurableElement'}
        }
    }
}

export default Standard;