import React from 'react';
import {StyleSheet} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import AssessmentPicker from './AssessmentPicker';
import Actions from "../../../action";
import PropTypes from 'prop-types';

class AssessmentType extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
    });

    static propTypes = {
        data: PropTypes.object.isRequired,
        actionSuffix: PropTypes.string
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