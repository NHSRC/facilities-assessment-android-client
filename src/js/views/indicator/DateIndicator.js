import {DatePickerAndroid, DatePickerIOS, Modal, Platform, Text, View} from 'react-native';
import {Button} from "native-base";
import React from 'react';
import AbstractComponent from '../common/AbstractComponent';
import _ from "lodash";
import ValidationErrorMessage from "./ValidationErrorMessage";
import General from "../../utility/General";
import Actions from '../../action';
import FieldLabel from "../common/FieldLabel";
import PrimaryColors from "../styles/PrimaryColors";
import PropTypes from 'prop-types';

class DateIndicator extends AbstractComponent {
    static MODE_MONTH = 1;
    static MODE_DATE = 2;

    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: PropTypes.object.isRequired,
        indicator: PropTypes.object,
        mode: PropTypes.number.isRequired,
        validationError: PropTypes.string,
        editing: PropTypes.bool
    };

    dateDisplay() {
        let date = _.isNil(this.props.indicator) ? null : this.props.indicator.dateValue;
        return _.isNil(date) ?
            this.getTitle()
            :
            this.props.mode === DateIndicator.MODE_DATE ? General.formatDate(date) : General.getDisplayMonth(date);
    }

    getTitle() {
        return this.props.mode === DateIndicator.MODE_DATE ? "CHOOSE DATE" : "CHOOSE (any day in) MONTH";
    }

    dateTextClicked(options) {
        if (Platform.OS === 'ios') {
            this.dispatchAction(Actions.DATE_INDICATOR_EDITING, {indicatorDefinitionUUID: this.props.definition.uuid});
        } else {
            this.showPicker(options);
        }
    }

    async showPicker(options) {
        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action !== DatePickerAndroid.dismissedAction) {
            let value = new Date(year, month, day);
            this.dispatchDateChange(value, false);
        }
    }

    dispatchDateChange(value, editing) {
        this.dispatchAction(Actions.DATE_INDICATOR_CHANGED, {indicatorDefinitionUUID: this.props.definition.uuid, value: value, editing: editing});
    }

    renderIOSDatePicker(date) {
        return <Modal transparent={true} visible={true}>
            <View style={{marginTop: 100, backgroundColor: PrimaryColors.header}}>
                <FieldLabel text={this.getTitle()} style={{color: 'white', backgroundColor: PrimaryColors.header, paddingLeft: 10, height: 40, padding: 10}}/>
                <DatePickerIOS date={date} onDateChange={(date) => this.dispatchDateChange(date, true)} mode="date" style={{backgroundColor: 'white'}}/>
                <Button style={{backgroundColor: PrimaryColors.blue, alignSelf: 'stretch'}} block
                        onPress={() => this.dispatchDateChange(date, false)}><Text>Done</Text></Button>
            </View>
        </Modal>;
    }

    render() {
        let date = _.isNil(this.props.indicator) ? new Date() : this.props.indicator.dateValue;
        return (
            <View>
                <FieldLabel text={this.props.definition.name} style={{color: 'white'}}/>
                {(Platform.OS === 'ios' && this.props.editing) ? this.renderIOSDatePicker(date) :
                    <Text onPress={this.dateTextClicked.bind(this, {date: date})}
                          style={{
                              flex: 1,
                              fontSize: 17,
                              color: _.isNil(this.props.validationResult) ? '#009688' : '#d0011b'
                          }}>{this.dateDisplay()}</Text>}
                <ValidationErrorMessage validationResult={this.props.validationError}/>
            </View>
        );
    }
}

export default DateIndicator;