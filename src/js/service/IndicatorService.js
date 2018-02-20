import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import IndicatorDefinition from "../models/IndicatorDefinition";

@Service("indicatorService")
class IndicatorService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    getIndicatorDefinitions(assessmentToolUUID) {
        return this.findAllByKey('assessmentTool', assessmentToolUUID, IndicatorDefinition.schema.name);
    }
}

export default IndicatorService;