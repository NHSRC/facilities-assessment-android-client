import React, {Component} from 'react';
import AbstractComponent from "../../common/AbstractComponent";
import {Button} from 'native-base';
import {StyleSheet} from 'react-native';
import PrimaryColors from "../../styles/PrimaryColors";
import _ from 'lodash';
import Actions from "../../../action";


class StartNewAssessment extends AbstractComponent {
    static styles = StyleSheet.create({
        blockButton: {
            backgroundColor: "#ffa000",
        },
    });

    render() {
        const isComplete = !(_.isEmpty(this.props.data.selectedAssessmentTool) || _.isEmpty(this.props.data.selectedAssessmentType));
        return (
            <Button
                onPress={() => {
                    this.dispatchAction(Actions.FACILITY_SELECT);
                    this.dispatchAction(Actions.ALL_ASSESSMENTS, {mode: this.props.mode});
                }}
                style={[StartNewAssessment.styles.blockButton, isComplete ?
                    {} : {backgroundColor: "rgba(0, 0, 0, 0.38)",}]}
                block
                disabled={!isComplete}>
                START NEW ASSESSMENT
            </Button>
        );
    }
}

export default StartNewAssessment;
