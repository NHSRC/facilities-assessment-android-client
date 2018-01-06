import React from "react";
import AbstractComponent from "../../common/AbstractComponent";
import {Button} from "native-base";
import {StyleSheet} from "react-native";
import _ from "lodash";
import Actions from "../../../action";
import EnvironmentConfig from "../../common/EnvironmentConfig";

class StartNewAssessment extends AbstractComponent {
    static styles = StyleSheet.create({
        blockButton: {
            backgroundColor: "#ffa000",
        },
    });

    render() {
        const seriesNameRequiredAndEntered = _.isEmpty(this.props.data.series);
        const isComplete = !(_.isEmpty(this.props.data.selectedAssessmentTool) || _.isEmpty(this.props.data.selectedAssessmentType) || seriesNameRequiredAndEntered);
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
