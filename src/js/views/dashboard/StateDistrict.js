import React, {Component} from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Actions from "../../action";
import AssessmentPicker from './AssessmentPicker';

const deviceWidth = Dimensions.get('window').width;

class StateDistrict extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        stateDistrict: {
            flexDirection: 'row'
        },
    });

    render() {
        const states = this.props.data.allStates;
        const selectedState = this.props.data.selectedState;
        const districts = this.props.data.districtsForState;
        const selectedDistrict = this.props.data.selectedDistrict;
        return (
            <View style={StateDistrict.styles.stateDistrict}>
                <AssessmentPicker
                    optStyles={{marginRight: deviceWidth * 0.04}}
                    message="Select State"
                    items={states}
                    action={Actions.SELECT_STATE}
                    stateKey={"selectedState"}
                    selectedValue={selectedState}
                />
                <AssessmentPicker
                    message="Select District"
                    items={districts}
                    action={Actions.SELECT_DISTRICT}
                    stateKey={"selectedDistrict"}
                    selectedValue={selectedDistrict}
                />
            </View>
        );
    }
}

export default StateDistrict;