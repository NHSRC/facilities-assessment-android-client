import Standard from "./Standard";
class AreaOfConcern {
    static schema = {
        name: 'AreaOfConcern',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            reference: 'string',
            standards: {type: 'list', objectType: 'Standard'}
        }
    };

    static fromDB(realmObj) {
        realmObj = Object.assign({}, realmObj);
        realmObj.standards = realmObj.standards.map(Standard.fromDB);
        return realmObj;
    }
}


export default AreaOfConcern;