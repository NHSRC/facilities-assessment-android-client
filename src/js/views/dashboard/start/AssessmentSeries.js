import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import _ from 'lodash';
import PrimaryColors from "../../styles/PrimaryColors";


class AssessmentSeries extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        input: {
            fontSize: 16,
            color: 'white',
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: 0.5
        }
    });

    handleChange(series) {
        this.dispatchAction(Actions.ENTER_ASSESSMENT_SERIES, {series: series});
    }

    render() {
        return (
            <TextInput style={AssessmentSeries.styles.input}
                       placeholder={"Enter Assessment Name"}
                       placeholderTextColor="rgba(255, 255, 255, 0.7)"
                       value={this.props.data.series}
                       underlineColorAndroid={PrimaryColors["dark_white"]}
                       words="words"
                       onChangeText={this.handleChange.bind(this)}/>
        );
    }
}

export default AssessmentSeries;