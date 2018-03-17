import {expect} from 'chai';
import _ from "lodash";
import Indicators from "../../../js/models/collections/Indicators";
import IndicatorDefinition from "../../../js/models/IndicatorDefinition";
import Indicator from "../../../js/models/Indicator";
import IndicatorDefinitions from "../../../js/models/collections/IndicatorDefinitions";

describe('IndicatorsTest', () => {
    it('evalCalculatedIndicatorValues', () => {
        let definitions = [numericDefinition('1', 'causeA'),
            numericDefinition('2', 'causeB'),
            numericDefinition('3', 'total', '(causeA + causeB)/2'),
            numericDefinition('4')];

        let indicators = [numericIndicator('1', 4), numericIndicator('2', 6), numericIndicator('3'), numericIndicator('4', 654)];
        let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(definitions, indicators, IndicatorDefinitions.resultsEvalCode(definitions));
        expect(get(indicators, '3').numericValue).is.equal(5);
        expect(get(indicators, '4').numericValue).is.equal(654);
        expect(calculatedIndicators.length).is.equal(1);
    });

    it('when some source numeric indicators are missing assume value of 0', function () {
        let definitions = [numericDefinition('1', 'causeA'),
            numericDefinition('2', 'causeB'),
            numericDefinition('3', 'total', '(causeA + causeB)/2'),
            numericDefinition('4')];
        let indicators = [numericIndicator('1', 4), numericIndicator('3'), numericIndicator('4', 654)];
        let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(definitions, indicators, IndicatorDefinitions.resultsEvalCode(definitions));
        expect(get(indicators, '3').numericValue).is.equal(2);
        expect(calculatedIndicators.length).is.equal(1);
    });

    it('create new when calculated indicators are not present', function () {
        let definitions = [numericDefinition('1', 'causeA'),
            numericDefinition('2', 'causeB'),
            numericDefinition('3', 'total', '(causeA + causeB)/2'),
            numericDefinition('4')];
        let indicators = [numericIndicator('1', 4), numericIndicator('4', 654)];
        let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(definitions, indicators, IndicatorDefinitions.resultsEvalCode(definitions));
        expect(calculatedIndicators.length).is.equal(1);
        expect(get(calculatedIndicators, '3').numericValue).is.equal(2);
    });

    it('handle divide by zero scenario', function () {
        let definitions = [numericDefinition('1', 'causeA'),
            numericDefinition('2', 'causeB'),
            numericDefinition('3', 'total', '(causeA * 100 / causeB)')];

        let indicators = [numericIndicator('1', 8)];
        let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(definitions, indicators, IndicatorDefinitions.resultsEvalCode(definitions));
        expect(get(calculatedIndicators, '3').numericValue).is.equal(Infinity);
        expect(calculatedIndicators.length).is.equal(1);
    });

    it('handle coded definition when creating formula', function () {
        let definitions = [codedDefinition('1', 'causeA'),
            codedDefinition('2', 'causeB'),
            codedDefinition('3', 'causeAAndB', '(causeA && causeB)')];
        let indicators = [codedIndicator('1', 'Yes'), codedIndicator('2', 'No')];
        let calculatedIndicators = Indicators.evalCalculatedIndicatorValues(definitions, indicators, IndicatorDefinitions.resultsEvalCode(definitions));
        expect(calculatedIndicators.length).is.equal(1);
        expect(get(calculatedIndicators, '3').codedValue).is.equal('No');
    });

    const get = function (indicators, indicatorDefinitionUUUID) {
        return Indicators.findIndicator(indicators, indicatorDefinitionUUUID);
    };

    const numericDefinition = function (uuid, symbol, formula) {
        return definition(uuid, symbol, IndicatorDefinition.DataType_Numeric, formula);
    };

    const percentageDefinition = function (uuid, symbol, formula) {
        return definition(uuid, symbol, IndicatorDefinition.DataType_Percentage, formula);
    };

    const codedDefinition = function (uuid, symbol, formula) {
        return definition(uuid, symbol, IndicatorDefinition.DataType_Coded, formula);
    };

    const definition = function (uuid, symbol, dataType, formula) {
        let indicatorDefinition = new IndicatorDefinition();
        indicatorDefinition.dataType = dataType;
        indicatorDefinition.symbol = symbol;
        indicatorDefinition.uuid = uuid;
        indicatorDefinition.formula = formula;
        indicatorDefinition.output = false;
        return indicatorDefinition;
    };

    const numericIndicator = function (definitionUUID, value) {
        let indicator = new Indicator();
        indicator.indicatorDefinition = definitionUUID;
        indicator.numericValue = value;
        return indicator;
    };

    const codedIndicator = function (definitionUUID, value) {
        let indicator = new Indicator();
        indicator.indicatorDefinition = definitionUUID;
        indicator.codedValue = value;
        return indicator;
    }
});