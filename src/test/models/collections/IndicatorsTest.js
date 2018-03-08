import {expect} from 'chai';
import _ from "lodash";
import Indicators from "../../../js/models/collections/Indicators";
import IndicatorDefinition from "../../../js/models/IndicatorDefinition";
import Indicator from "../../../js/models/Indicator";
import IndicatorDefinitions from "../../../js/models/collections/IndicatorDefinitions";

describe('IndicatorsTest', () => {
    it('evalCalculatedIndicatorValues', () => {
        let definitions = [definition('1', 'causeA'),
            definition('2', 'causeB'),
            definition('3', 'total', '(causeA + causeB)/2'),
            definition('4')];

        let indicators = [indicator('1', 4), indicator('2', 6), indicator('3'), indicator('4', 654)];
        Indicators.evalCalculatedIndicatorValues(definitions, indicators, IndicatorDefinitions.resultsEvalCode(definitions));
        expect(get(indicators, '3').numericValue).is.equal(5);
        expect(get(indicators, '4').numericValue).is.equal(654);
    });

    const get = function (indicators, indicatorDefinitionUUUID) {
        return Indicators.findIndicator(indicators, indicatorDefinitionUUUID);
    };

    const definition = function (uuid, symbol, formula) {
        let indicatorDefinition = new IndicatorDefinition();
        indicatorDefinition.dataType = IndicatorDefinition.DataType_Numeric;
        indicatorDefinition.symbol = symbol;
        indicatorDefinition.uuid = uuid;
        indicatorDefinition.formula = formula;
        indicatorDefinition.output = false;
        indicatorDefinition.calculated = !_.isNil(formula);
        return indicatorDefinition;
    };

    const indicator = function (definitionUUID, value) {
        let indicator = new Indicator();
        indicator.indicatorDefinition = definitionUUID;
        indicator.numericValue = value;
        return indicator;
    }
});