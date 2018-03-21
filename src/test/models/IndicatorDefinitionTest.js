import {expect} from 'chai';
import _ from "lodash";
import IndicatorDefinition from "../../js/models/IndicatorDefinition";

describe('IndicatorDefinitionTest', () => {
    it('isCalculated', function () {
        expect(IndicatorDefinition.isCalculated(definition(undefined, IndicatorDefinition.DataType_Numeric, 'x+y', true), false)).is.false;
    });

    it('isInputNumeric', () => {
        expect(IndicatorDefinition.isInputNumeric(definition('a', IndicatorDefinition.DataType_Numeric))).is.true;
        expect(IndicatorDefinition.isInputNumeric(definition(undefined, IndicatorDefinition.DataType_Numeric, 'x+y'))).is.false;
        expect(IndicatorDefinition.isInputNumeric(definition(undefined, IndicatorDefinition.DataType_Numeric, 'x+y', true))).is.false;
        expect(IndicatorDefinition.isInputNumeric(definition(undefined, IndicatorDefinition.DataType_Percentage, '(x)*100/y', true))).is.false;
    });

    const definition = function (symbol, dataType, formula, isOutput = false) {
        let indicatorDefinition = new IndicatorDefinition();
        indicatorDefinition.dataType = dataType;
        indicatorDefinition.symbol = symbol;
        indicatorDefinition.formula = formula;
        indicatorDefinition.output = isOutput;
        return indicatorDefinition;
    };
});