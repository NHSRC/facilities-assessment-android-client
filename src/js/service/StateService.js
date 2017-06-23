import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import State from "../models/State";
import District from "../models/District";

@Service("stateService")
class StateService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveState = this.save(State);
        this.saveDistrict = this.save(District);
    }

    init() {
    }

    getAllStates() {
        return this.db.objects(State.schema.name);
    }

    getDistrict(districtUUID) {
        return this.pickKeys(["uuid", "name", "facilities"])(this.db.objectForPrimaryKey(District.schema.name, districtUUID));
    }
}

export default StateService;