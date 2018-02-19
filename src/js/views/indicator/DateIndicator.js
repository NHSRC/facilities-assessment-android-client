import {View, StyleSheet, Text, DatePickerAndroid} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import _ from "lodash";
import ValidationErrorMessage from "./ValidationErrorMessage";
import General from "../../utility/General";
import Actions from '../../action';

class DateIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired
    };

    static dateDisplay(date) {
        return _.isNil(date) ? "Choose a date" : General.formatDate(date);
    }

    async showPicker(options) {
        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action !== DatePickerAndroid.dismissedAction) {
            this.props.dateValue = new Date(year, month, day);
            this.dispatchAction(Actions.DATE_INDICATOR_CHANGED, {definition: this.props.definition, value: this.props.dateValue});
        }
    }

    render() {
        const date = _.isNil(this.props.dateValue) ? new Date() : this.props.dateValue;
        return (
            <View>
                <Text onPress={this.showPicker.bind(this, {date: date})}
                      style={{
                          flex: 1,
                          fontSize: 17,
                          color: _.isNil(this.props.validationResult) ? '#009688' : '#d0011b'
                      }}>{DateIndicator.dateDisplay(this.props.dateValue)}</Text>
                <ValidationErrorMessage validationResult={this.props.validationResult}/>
            </View>
        );
    }
}

export default DateIndicator;