import React, {Component} from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Button} from 'native-base';
import {StyleSheet} from 'react-native';
import PrimaryColors from "../styles/PrimaryColors";
import _ from 'lodash';


class StartNewAssessment extends AbstractComponent {
    static styles = StyleSheet.create({
        blockButton: {
            backgroundColor: PrimaryColors.blue,
        },
    });

    render() {
        const isComplete = !(_.isEmpty(this.props.data.selectedAssessmentTool) || _.isEmpty(this.props.data.selectedAssessmentType));
        return (
            <Button
                style={[StartNewAssessment.styles.blockButton, isComplete ? {} : {backgroundColor: "rgba(0, 0, 0, 0.38)",}]}
                block>
                START NEW ASSESSMENT
            </Button>
        );
    }
}

export default StartNewAssessment;
