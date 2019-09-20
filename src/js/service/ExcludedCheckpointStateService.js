import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import EntityService from "./EntityService";
import Checkpoint from "../models/Checkpoint";
import State from "../models/State";
import ResourceUtil from "../utility/ResourceUtil";
import ExcludedCheckpointState from "../models/ExcludedCheckpointState";

@Service("excludedCheckpointStateService")
class ExcludedCheckpointStateService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    saveWithinTx(entityClass, resource) {
        let entityService = new EntityService(this.db, this.beanStore);
        let excludedCheckpointState = new ExcludedCheckpointState();
        excludedCheckpointState.uuid = resource.uuid;
        excludedCheckpointState.checkpoint = entityService.findByUUID(ResourceUtil.getUUIDFor(resource, 'checkpointUUID'), Checkpoint.schema.name);
        excludedCheckpointState.state = entityService.findByUUID(ResourceUtil.getUUIDFor(resource, 'stateUUID'), State.schema.name);
        excludedCheckpointState.inactive = resource["inactive"];
        excludedCheckpointState.checkpoint.excludedStates.push(excludedCheckpointState);
    }
}

export default ExcludedCheckpointStateService;