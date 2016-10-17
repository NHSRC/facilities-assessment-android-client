class MeasurableElement {
    static schema = {
        name: 'MeasurableElement',
        properties: {
            referenceUUID: 'string',
            checkpoints: {type: 'list', objectType: 'Checkpoint'}
        }
    }
}

export default MeasurableElement;