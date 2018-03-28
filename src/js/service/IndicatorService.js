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

    getIndicatorDefinitions(assessmentToolUUID, isOutput) {
        let indicatorDefinitions = [...this.findAllByCriteria(`assessmentTool = "${assessmentToolUUID}" AND output = ${isOutput}`, IndicatorDefinition.schema.name)];
        return _.sortBy(indicatorDefinitions, (indicatorDefinition) => indicatorDefinition.sortOrder);
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

    saveAllOutputIndicators(indicators, facilityAssessment) {
        this.db.write(() => {
            let savedIndicators = [...this.findAllByCriteria(`facilityAssessment = "${facilityAssessment.uuid}"`, Indicator.schema.name)];
            _.forEach(savedIndicators, savedIndicator => {
                let indicatorDefinition = this.findByUUID(savedIndicator.indicatorDefinition, IndicatorDefinition.schema.name);
                if (indicatorDefinition.output)
                    this.db.delete(savedIndicator);
            });
            indicators.forEach(indicator => {
                this.db.create(Indicator.schema.name, indicator);
            });
        });
    }
}

export default IndicatorService;