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
        indicatorDefinitions: React.PropTypes.array.isRequired
    };

    render() {
        let map = new Map();
        map.set(IndicatorDefinition.Numeric, (indicatorDefinition) => <NumericIndicator definition={indicatorDefinition}/>);
        map.set(IndicatorDefinition.Month, (indicatorDefinition) => <NumericIndicator definition={indicatorDefinition}/>);
        map.set(IndicatorDefinition.Percentage, (indicatorDefinition) => <NumericIndicator definition={indicatorDefinition}/>);
        map.set(IndicatorDefinition.Boolean, (indicatorDefinition) => <BoolIndicator definition={indicatorDefinition}/>);
        map.set(IndicatorDefinition.Date, (indicatorDefinition) => <DateIndicator definition={indicatorDefinition}/>);

        return <View>{this.props.indicatorDefinitions.map((indicatorDefinition) => <View style={{marginTop: deviceHeight*0.025}}>{map.get(indicatorDefinition.dataType)(indicatorDefinition)}</View>)}</View>;
    }
}

export default Indicators;