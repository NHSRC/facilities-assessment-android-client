import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
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
        return this.db.objects(State.schema.name).sorted('name').map(this.nameAndId);
    }

    getDistrict(districtUUID) {
        return this.pickKeys(["uuid", "name", "facilities"])(this.db.objectForPrimaryKey(District.schema.name, districtUUID));
    }
}

export default StateService;