class ReferenceMeasurableElement {
    static schema = {
        name: 'ReferenceMeasurableElement',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            reference: 'string',
            question: 'string'
        }
    }
}

export default ReferenceMeasurableElement;