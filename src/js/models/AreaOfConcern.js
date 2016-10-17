class AreaOfConcern {
    static schema = {
        name: 'AreaOfConcern',
        properties: {
            referenceUUID: 'string',
            applicableStandards: {type: 'list', objectType: 'Standard'}
        }
    }
}


export default AreaOfConcern;