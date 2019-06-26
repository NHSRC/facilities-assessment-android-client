import React from "react";
import AbstractComponent from "../../common/AbstractComponent";
import {Button} from "native-base";
import {StyleSheet, Text} from "react-native";
import _ from "lodash";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import {FacilitySelectionState} from "../../../action/facilitySelection";
import PropTypes from 'prop-types';

class StartNewAssessment extends AbstractComponent {
    static styles = StyleSheet.create({
        blockButton: {
            backgroundColor: "#ffa000",
        },
    });

    static propTypes = {
        data: PropTypes.object,
        mode: PropTypes.string.isRequired
    };

    render() {
        const isComplete = FacilitySelectionState.isFacilityChosen(this.props.data);
        return (
            <Button
                onPress={() => {
                    this.dispatchAction(Actions.FACILITY_SELECT);
                    this.dispatchAction(Actions.ALL_ASSESSMENTS, {mode: this.props.mode});
                }}
                style={isComplete? StartNewAssessment.styles.blockButton : {backgroundColor: PrimaryColors.medium_black}}
                block
                disabled={!isComplete}>
                <Text>START NEW ASSESSMENT</Text>
            </Button>
        );
    }
}

export default StartNewAssessment;
