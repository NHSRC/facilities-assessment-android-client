import MeasurableElements from './MeasurableElement';
class Standard {
    static schema = {
        name: 'Standard',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            tags: {type: 'list', objectType: 'Tag'},
            measurableElements: {type: 'list', objectType: 'MeasurableElement'}
        }
    };

    static fromDB(realmObj) {
        realmObj = Object.assign({}, realmObj);
        realmObj.measurableElements = realmObj.measurableElements.map(MeasurableElements.fromDB);
        return realmObj;
    }
}

export default Standard;