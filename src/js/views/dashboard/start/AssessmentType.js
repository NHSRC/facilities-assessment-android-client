import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import AssessmentPicker from './AssessmentPicker';
import Actions from "../../../action";

class AssessmentType extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
    });

    static propTypes = {
        data: React.PropTypes.object.isRequired,
        actionSuffix: React.PropTypes.string
    };

    render() {
        const assessmentTypes = this.props.data.assessmentTypes;
        const selectedAssessmentType = this.props.data.selectedAssessmentType;
        return (
            <AssessmentPicker
                message="Select Assessment Type"
                items={assessmentTypes}
                action={`${Actions.SELECT_ASSESSMENT_TYPE}${this.props.actionSuffix}`}
                stateKey={"selectedAssessmentType"}
                selectedValue={selectedAssessmentType}
            />
        );
    }
}

export default AssessmentType;