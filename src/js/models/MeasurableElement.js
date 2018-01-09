class MeasurableElement {
    static schema = {
        name: 'MeasurableElement',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
        }
    };

    static fromDB(realmObj) {
        return realmObj;
    }

    static getDisplayName(measurableElement) {
        return `${measurableElement.reference} - ${measurableElement.name}`;
    }
}

export default MeasurableElement;