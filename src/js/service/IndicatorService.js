import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import IndicatorDefinition from "../models/IndicatorDefinition";
import Indicator from "../models/Indicator";
import _ from 'lodash';

@Service("indicatorService")
class IndicatorService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    getIndicatorDefinitions(assessmentToolUUID) {
        return this.findAllByKey('assessmentTool', assessmentToolUUID, IndicatorDefinition.schema.name);
    }

    getIndicator(indicatorDefinitionUUID, assessmentUUID) {
        let indicator = this.findByCriteria(`indicatorDefinition = "${indicatorDefinitionUUID}" and facilityAssessment = "${assessmentUUID}"`, Indicator.schema.name);
        if (_.isNil(indicator)) return {};
        return Object.assign({}, indicator);
    }

    saveIndicator(indicator) {
        if (_.isNil(indicator.uuid))
    }
}

export default IndicatorService;