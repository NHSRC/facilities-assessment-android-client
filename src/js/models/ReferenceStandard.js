class ReferenceStandard {
    static schema = {
        name: 'ReferenceStandard',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
            reference: 'string',
            measurableElements: {type: 'list', objectType: 'ReferenceMeasurableElement'}
        }
    }
}


export default ReferenceStandard;