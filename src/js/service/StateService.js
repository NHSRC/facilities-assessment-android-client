import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import State from "../models/State";
import District from "../models/District";

@Service("stateService")
class StateService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveDistrict = this.save(District);
    }

    init() {
    }

    get schemaName() {
        return State.schema.name;
    }

    getAllStates() {
        return this.db.objects(State.schema.name).filtered("inactive = false").sorted('name').map(this.nameAndId);
    }

    getDistrict(districtUUID) {
        return this.pickKeys(["uuid", "name", "facilities"])(this.db.objectForPrimaryKey(District.schema.name, districtUUID));
    }
    
    deleteStatesExcept(state) {
        const db = this.db;
        db.write(() => {
            let allEntities = db.objects(State.schema.name).filtered('uuid != $0', state.uuid);
            db.delete(allEntities);
        });
    }

    getStateName(stateUUID) {
        return this.findByUUID(stateUUID).name;
    }

    find(stateUUID) {
        return this.nameAndId(this.findByUUID(stateUUID));
    }
}

export default StateService;