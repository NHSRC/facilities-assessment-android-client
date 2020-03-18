import Service from "../framework/bean/Service";
import BaseService from "./BaseService";
import EntityService from "./EntityService";
import State from "../models/State";
import AssessmentTool from "../models/AssessmentTool";
import ResourceUtil from "../utility/ResourceUtil";
import ExcludedAssessmentToolState from "../models/ExcludedAssessmentToolState";
import _ from 'lodash';

@Service("excludedAssessmentToolStateService")
class ExcludedAssessmentToolStateService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    saveWithinTx(entityClass, resource) {
        let entityService = new EntityService(this.db, this.beanStore);
        let excludedAssessmentToolState = new ExcludedAssessmentToolState();
        excludedAssessmentToolState.uuid = resource.uuid;
        excludedAssessmentToolState.assessmentTool = entityService.findByUUID(ResourceUtil.getUUIDFor(resource, 'assessmentToolUUID'), AssessmentTool.schema.name);
        excludedAssessmentToolState.state = entityService.findByUUID(ResourceUtil.getUUIDFor(resource, 'stateUUID'), State.schema.name);
        excludedAssessmentToolState.inactive = resource["inactive"];
        if (!_.some(excludedAssessmentToolState.assessmentTool.excludedStates, (excludedAssessmentToolState) => excludedAssessmentToolState.uuid === resource.uuid)) {
            excludedAssessmentToolState.assessmentTool.excludedStates.push(excludedAssessmentToolState);
        }
    }
}

export default ExcludedAssessmentToolStateService;