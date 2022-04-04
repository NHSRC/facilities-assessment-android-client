const meReference = new RegExp("([A-Z]{1})([0-9]{1,3})\.([0-9]{1,3})");

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

    static sortOrder(reference) {
        return parseInt(reference.match(meReference)[3]);
    }
}

export default MeasurableElement;
