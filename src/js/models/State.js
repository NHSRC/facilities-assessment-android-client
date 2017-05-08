import ResourceUtil from "../utility/ResourceUtil";
import BaseEntity from "./BaseEntity";
import General from "../utility/General";

class State extends BaseEntity {
    static schema = {
        name: 'State',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            districts: {type: 'list', objectType: 'District'}
        }
    };

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        var state = entityService.findByUUID(ResourceUtil.getUUIDFor(childResource, "stateUUID"), State.schema.name);
        state = General.pick(state, ["uuid"], ["districts"]);
        if (childEntityClass.schema.name === 'District') {
            BaseEntity.addOrUpdateChild(this.districts, childEntity);
        }
        return state;
    }
}


export default State;