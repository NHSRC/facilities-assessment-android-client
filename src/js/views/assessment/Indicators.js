import React, {Component} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Typography from '../styles/Typography';
import {formatDateHuman} from "../../utility/DateUtils";
import IndicatorDefinition from "../../models/IndicatorDefinition";
import NumericIndicator from "../indicator/NumericIndicator";
import BoolIndicator from "../indicator/BoolIndicator";
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
        map.set(IndicatorDefinition.Numeric, (indicatorDefinition, indicator) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.Month, (indicatorDefinition, indicator) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.Percentage, (indicatorDefinition, indicator) => <NumericIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.Boolean, (indicatorDefinition, indicator) => <BoolIndicator definition={indicatorDefinition} indicator={indicator}/>);
        map.set(IndicatorDefinition.Date, (indicatorDefinition, indicator) => <DateIndicator definition={indicatorDefinition} indicator={indicator}/>);

        return <View>{this.props.indicatorDefinitions.map((indicatorDefinition) => {
            let indicator = _.find(this.props.indicators, (indicator) => indicator.indicatorDefinition === indicatorDefinition.uuid);
            return <View style={{marginTop: deviceHeight * 0.025}} key={indicatorDefinition.uuid}>{map.get(indicatorDefinition.dataType)(indicatorDefinition, indicator)}</View>;
        })}</View>;
    }
}

export default Indicators;