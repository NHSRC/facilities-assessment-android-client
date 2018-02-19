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

    static styles = StyleSheet.create({
    });

    render() {
        return <View>{this.props.indicatorDefinitions.map((indicatorDefinition) => {
            if (indicatorDefinition.dataType === IndicatorDefinition.Numeric) return <NumericIndicator definition={indicatorDefinition}/>;
            else if (indicatorDefinition.dataType === IndicatorDefinition.Boolean) return <BoolIndicator definition={indicatorDefinition}/>;
            else if (indicatorDefinition.dataType === IndicatorDefinition.Date) return <DateIndicator definition={indicatorDefinition}/>;
        })}</View>;
    }
}

export default Indicators;