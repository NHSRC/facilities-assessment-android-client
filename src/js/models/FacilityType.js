import BaseEntity from "./BaseEntity";

class FacilityType extends BaseEntity {
    static schema = {
        name: 'FacilityType',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string'
        }
    }
}


export default FacilityType;