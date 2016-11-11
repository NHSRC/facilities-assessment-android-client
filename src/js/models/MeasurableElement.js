class MeasurableElement {
    static schema = {
        name: 'MeasurableElement',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string'
        }
    };

    static fromDB(realmObj) {
        return realmObj;
    }
}

export default MeasurableElement;