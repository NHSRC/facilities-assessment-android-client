import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import IndicatorDefinition from "../models/IndicatorDefinition";
import Indicator from "../models/Indicator";
import _ from 'lodash';
import UUID from "../utility/UUID";

@Service("indicatorService")
class IndicatorService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    getIndicatorDefinitions(assessmentToolUUID) {
        return this.findAllByKey('assessmentTool', assessmentToolUUID, IndicatorDefinition.schema.name);
    }

    getIndicator(indicatorDefinitionUUID, assessmentUUID) {
        let indicator = this.findByCriteria(`indicatorDefinition = "${indicatorDefinitionUUID}" and facilityAssessment = "${assessmentUUID}"`, Indicator);
        if (_.isNil(indicator)) return Indicator.newIndicator(indicatorDefinitionUUID, assessmentUUID);
        return Object.assign(new Indicator(), indicator);
    }

    getIndicators(assessmentUUID) {
        let indicators = this.findAllByCriteria(`facilityAssessment = "${assessmentUUID}"`, Indicator.schema.name);
        return indicators.map((indicator) => Object.assign(new Indicator(), indicator));
    }

    saveIndicator(indicator) {
        if (_.isNil(indicator.uuid)) indicator.uuid = UUID.generate();
        return this.save(Indicator)(indicator);
    }
}

export default IndicatorService;