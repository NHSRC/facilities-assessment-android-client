import React from "react";
import {StyleSheet, TextInput} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";


class FacilityText extends AbstractComponent {
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

    handleChange(facilityName) {
        this.dispatchAction(Actions.ENTER_FACILITY_NAME, {facilityName: facilityName});
    }

    render() {
        return (
            <TextInput style={FacilityText.styles.input}
                       placeholder={"Enter Facility Name"}
                       placeholderTextColor="rgba(255, 255, 255, 0.7)"
                       value={this.props.data.facilityName}
                       underlineColorAndroid={PrimaryColors["dark_white"]}
                       words="words"
                       onChangeText={this.handleChange.bind(this)}/>
        );
    }
}

export default FacilityText;