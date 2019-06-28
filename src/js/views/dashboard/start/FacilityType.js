import React from 'react';
import {StyleSheet} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import AssessmentPicker from './AssessmentPicker';


class FacilityType extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({});

    render() {
        const facilityTypes = this.props.data.facilityTypes;
        const selectedFacilityType = this.props.data.selectedFacilityType;
        return (
            <AssessmentPicker
                optStyles={{flex: 1}}
                message="Select Facility Type"
                items={facilityTypes}
                action={Actions.SELECT_FACILITY_TYPE}
                stateKey={"selectedFacilityType"}
                selectedValue={selectedFacilityType}
            />
        );
    }
}

export default FacilityType;