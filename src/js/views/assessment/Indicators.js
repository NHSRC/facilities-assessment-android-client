import React, {Component} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import IndicatorDefinition from "../../models/IndicatorDefinition";
import NumericIndicator from "../indicator/NumericIndicator";
import CodedValueIndicator from "../indicator/CodedValueIndicator";
import DateIndicator from "../indicator/DateIndicator";
import IndicatorDefinitions from "../../models/collections/IndicatorDefinitions";
import Logger from "../../framework/Logger";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const uiComponentMap = new Map();
let numericIndicatorFn = (indicatorDefinition, indicator, errorMessage, tabIndex, overallIndex, isLast) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}
                                                                                                       validationError={errorMessage} tabIndex={tabIndex} overallIndex={overallIndex} isLast={isLast}/>;
uiComponentMap.set(IndicatorDefinition.DataType_Numeric, numericIndicatorFn);
uiComponentMap.set(IndicatorDefinition.DataType_Percentage, numericIndicatorFn);
uiComponentMap.set(IndicatorDefinition.DataType_Month, (indicatorDefinition, indicator, errorMessage) => <DateIndicator definition={indicatorDefinition}
                                                                                                                        indicator={indicator}
                                                                                                                        mode={DateIndicator.MODE_MONTH}
                                                                                                                        validationError={errorMessage}/>);
uiComponentMap.set(IndicatorDefinition.DataType_Coded, (indicatorDefinition, indicator, errorMessage) => <CodedValueIndicator definition={indicatorDefinition}
                                                                                                                              indicator={indicator}
                                                                                                                              validationError={errorMessage}/>);
uiComponentMap.set(IndicatorDefinition.DataType_Date, (indicatorDefinition, indicator, errorMessage) => <DateIndicator definition={indicatorDefinition}
                                                                                                                       indicator={indicator}
                                                                                                                       mode={DateIndicator.MODE_DATE}
                                                                                                                       validationError={errorMessage}/>);

class Indicators extends AbstractComponent {
    static userNumericInputs = {};

    static focusOnNextInput(currentIndex) {
        let currentInput = Indicators.userNumericInputs[currentIndex];
        let nextInput = Indicators.userNumericInputs[currentIndex + 1];
        if (_.isNil(nextInput)) {
            require("dismissKeyboard")();
            return;
        }

        if ((currentInput.overallIndex + 1) === nextInput.overallIndex) {
            nextInput.element.focus();
        } else {
            require("dismissKeyboard")();
        }
    }

    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        indicatorDefinitions: React.PropTypes.any.isRequired,
        indicators: React.PropTypes.any.isRequired,
        indicatorDefinitionsWithError: React.PropTypes.array
    };

    componentWillUnmount() {
        super.componentWillUnmount();
        Indicators.userNumericInputs = {};
    }

    render() {
        Logger.logDebug('Indicators', this.props.indicatorDefinitionsWithError);
        Indicators.userNumericInputs = {};
        let numberOfInputNumericFields = IndicatorDefinitions.numberOfInputNumericFields(this.props.indicatorDefinitions);
        let tabIndex = 0;
        let overallIndex = 0;
        return <View>{this.props.indicatorDefinitions.map((indicatorDefinition) => {
            let indicator = _.find(this.props.indicators, (indicator) => indicator.indicatorDefinition === indicatorDefinition.uuid);
            let errorMessage = _.some(this.props.indicatorDefinitionsWithError, (unfilledDef) => unfilledDef.uuid === indicatorDefinition.uuid) ? IndicatorDefinition.errorMessageFor(indicatorDefinition) : undefined;
            if (!IndicatorDefinition.isFormulaNumeric(indicatorDefinition)) overallIndex++;
            if (IndicatorDefinition.isInputNumeric(indicatorDefinition)) tabIndex++;
            return <View style={{marginTop: deviceHeight * 0.025}}
                         key={indicatorDefinition.uuid}>{uiComponentMap.get(indicatorDefinition.dataType)(indicatorDefinition, indicator, errorMessage, tabIndex, overallIndex, tabIndex === numberOfInputNumericFields)}</View>;
        })}</View>;
    }
}

export default Indicators;