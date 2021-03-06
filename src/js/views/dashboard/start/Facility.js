import React from 'react';
import {StyleSheet} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import AssessmentPicker from './AssessmentPicker';
import Actions from "../../../action";


class Facility extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({});

    render() {
        const facilities = this.props.data.facilities;
        const selectedFacility = this.props.data.selectedFacility;
        return (
            <AssessmentPicker
                optStyles={{flex: 1}}
                nullable={true}
                message="Select Facility"
                items={facilities}
                action={Actions.SELECT_FACILITY}
                stateKey={"selectedFacility"}
                selectedValue={selectedFacility}
            />
        );
    }
}

export default Facility;