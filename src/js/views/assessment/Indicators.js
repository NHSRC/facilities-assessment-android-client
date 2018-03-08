import React, {Component} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import IndicatorDefinition from "../../models/IndicatorDefinition";
import NumericIndicator from "../indicator/NumericIndicator";
import CodedValueIndicator from "../indicator/CodedValueIndicator";
import DateIndicator from "../indicator/DateIndicator";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Indicators extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        indicatorDefinitions: React.PropTypes.any.isRequired,
        indicators: React.PropTypes.any.isRequired
    };

    render() {
        let map = new Map();
        map.set(IndicatorDefinition.DataType_Numeric, (indicatorDefinition, indicator) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.DataType_Month, (indicatorDefinition, indicator) => <DateIndicator definition={indicatorDefinition} indicator={indicator} mode={DateIndicator.MODE_MONTH}/>);
        map.set(IndicatorDefinition.DataType_Percentage, (indicatorDefinition, indicator) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.DataType_Coded, (indicatorDefinition, indicator) => <CodedValueIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.DataType_Date, (indicatorDefinition, indicator) => <DateIndicator definition={indicatorDefinition} indicator={indicator} mode={DateIndicator.MODE_DATE}/>);

        return <View>{this.props.indicatorDefinitions.map((indicatorDefinition) => {
            let indicator = _.find(this.props.indicators, (indicator) => indicator.indicatorDefinition === indicatorDefinition.uuid);
            return <View style={{marginTop: deviceHeight * 0.025}} key={indicatorDefinition.uuid}>{map.get(indicatorDefinition.dataType)(indicatorDefinition, indicator)}</View>;
        })}</View>;
    }
}

export default Indicators;