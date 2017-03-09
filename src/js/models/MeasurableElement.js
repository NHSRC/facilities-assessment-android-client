class MeasurableElement {
    static schema = {
        name: 'MeasurableElement',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            tags: {type: 'list', objectType: 'Tag'},
        }
    };

    static fromDB(realmObj) {
        return realmObj;
    }
}

export default MeasurableElement;