import {View, StyleSheet, Text, DatePickerAndroid} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import _ from "lodash";
import ValidationErrorMessage from "./ValidationErrorMessage";
import General from "../../utility/General";
import Actions from '../../action';
import FieldLabel from "../common/FieldLabel";

class DateIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired,
        indicator: React.PropTypes.object
    };

    static dateDisplay(date) {
        return _.isNil(date) ? "Choose a date" : General.formatDate(date);
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
                <FieldLabel text={this.props.definition.name}/>
                <Text onPress={this.showPicker.bind(this, {date: _.isNil(this.props.indicator) ? new Date() : this.props.indicator.dateValue})}
                      style={{
                          flex: 1,
                          fontSize: 17,
                          color: _.isNil(this.props.validationResult) ? '#009688' : '#d0011b'
                      }}>{DateIndicator.dateDisplay(_.isNil(this.props.indicator) ? null : this.props.indicator.dateValue)}</Text>
                <ValidationErrorMessage validationResult={this.props.validationResult}/>
            </View>
        );
    }
}

export default DateIndicator;