import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import State from "../models/State";

@Service("stateService")
class StateService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveState = this.save(State);
    }

    init() {
    }

    getAllStates() {
        return this.db.objects(State.schema.name);
    }
}

export default StateService;