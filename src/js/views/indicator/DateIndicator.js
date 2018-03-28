import {View, StyleSheet, Text, DatePickerAndroid} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import _ from "lodash";
import ValidationErrorMessage from "./ValidationErrorMessage";
import General from "../../utility/General";
import Actions from '../../action';
import FieldLabel from "../common/FieldLabel";

class DateIndicator extends AbstractComponent {
    static MODE_MONTH = 1;
    static MODE_DATE = 2;

    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired,
        indicator: React.PropTypes.object,
        mode: React.PropTypes.number.isRequired,
        validationError: React.PropTypes.string
    };

    dateDisplay() {
        let date = _.isNil(this.props.indicator) ? null : this.props.indicator.dateValue;
        return _.isNil(date) ?
            this.props.mode === DateIndicator.MODE_DATE ? "CHOOSE DATE" : "CHOOSE (any day in) MONTH"
            :
            this.props.mode === DateIndicator.MODE_DATE ? General.formatDate(date) : General.getDisplayMonth(date);
    }

    async showPicker(options) {
        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action !== DatePickerAndroid.dismissedAction) {
            let value = new Date(year, month, day);
            this.dispatchAction(Actions.DATE_INDICATOR_CHANGED, {indicatorDefinitionUUID: this.props.definition.uuid, value: value});
        }
    }

    render() {
        return (
            <View>
                <FieldLabel text={this.props.definition.name} style={{color: 'white'}}/>
                <Text onPress={this.showPicker.bind(this, {date: _.isNil(this.props.indicator) ? new Date() : this.props.indicator.dateValue})}
                      style={{
                          flex: 1,
                          fontSize: 17,
                          color: _.isNil(this.props.validationResult) ? '#009688' : '#d0011b'
                      }}>{this.dateDisplay()}</Text>
                <ValidationErrorMessage validationResult={this.props.validationError}/>
            </View>
        );
    }
}

export default DateIndicator;