import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import AssessmentPicker from './AssessmentPicker';
import Actions from "../../../action";
import _ from 'lodash';


class FacilityText extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        input: {
            fontSize: 16,
            color: 'white'
        }
    });

    handleChange(facilityName) {
        this.dispatchAction(Actions.ENTER_FACILITY_NAME, {facilityName: facilityName});
    }

    render() {
        return (
            <TextInput style={FacilityText.styles.input}
                       placeholder={"Enter Facility Name"}
                       placeholderTextColor="rgba(255, 255, 255, 0.7)"
                       value={this.props.data.facilityName}
                       underlineColorAndroid="rgba(255, 255, 255, 0.12)"
                       words="words"
                       onChangeText={this.handleChange.bind(this)}/>
        );
    }
}

export default FacilityText;