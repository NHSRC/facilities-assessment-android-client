import React, {Component} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import IndicatorDefinition from "../../models/IndicatorDefinition";
import NumericIndicator from "../indicator/NumericIndicator";
import CodedValueIndicator from "../indicator/CodedValueIndicator";
import DateIndicator from "../indicator/DateIndicator";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const uiComponentMap = new Map();
let numericIndicatorFn = (indicatorDefinition, indicator, errorMessage) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}
                                                                                             validationError={errorMessage}/>;
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
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        indicatorDefinitions: React.PropTypes.any.isRequired,
        indicators: React.PropTypes.any.isRequired,
        indicatorDefinitionsInError: React.PropTypes.array
    };

    render() {
        return <View>{this.props.indicatorDefinitions.map((indicatorDefinition) => {
            let indicator = _.find(this.props.indicators, (indicator) => indicator.indicatorDefinition === indicatorDefinition.uuid);
            let errorMessage = _.some(this.props.indicatorDefinitionsInError, (unfilledDef) => unfilledDef.uuid === indicatorDefinition.uuid) ? IndicatorDefinition.errorMessageFor(indicatorDefinition.dataType) : undefined;
            return <View style={{marginTop: deviceHeight * 0.025}}
                         key={indicatorDefinition.uuid}>{uiComponentMap.get(indicatorDefinition.dataType)(indicatorDefinition, indicator, errorMessage)}</View>;
        })}</View>;
    }
}

export default Indicators;