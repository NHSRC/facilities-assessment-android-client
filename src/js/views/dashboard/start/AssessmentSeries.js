import React from "react";
import {Platform, StyleSheet, TextInput} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
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
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

    handleChange(series) {
        this.dispatchAction(Actions.ENTER_ASSESSMENT_SERIES, {series: series});
    }

    render() {
        return (
            <TextInput style={AssessmentSeries.styles.input}
                       placeholder={"Assessment Series Number"}
                       placeholderTextColor="rgba(255, 255, 255, 0.7)"
                       value={this.props.data.series}
                       underlineColorAndroid={PrimaryColors["dark_white"]}
                       words="words"
                       keyboardType='numeric'
                       onChangeText={this.handleChange.bind(this)}/>
        );
    }
}

export default AssessmentSeries;