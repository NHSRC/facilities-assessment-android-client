class Standard {
    static schema = {
        name: 'Standard',
        properties: {
            referenceUUID: 'string',
            applicableMeasurableElements: {type: 'list', objectType: 'MeasurableElement'}
        }
    }
}

export default Standard;