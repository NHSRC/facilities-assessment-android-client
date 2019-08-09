import React from "react";
import {Dimensions, Platform, ProgressBarAndroid, ProgressViewIOS, StyleSheet, Text, View} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import _ from 'lodash';

const deviceHeight = Dimensions.get('window').height;

class AssessmentStatus extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        statusContainer: {
            marginTop: deviceHeight * .02708,
        },
        textContainer: {
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between"
        },
        textColor: {
            color: "white"
        },
    });

    render() {
        const progressRatio = this.props.assessmentProgress.completed / this.props.assessmentProgress.total;
        const progressBarColor = progressRatio < 1 ? PrimaryColors.complete : PrimaryColors.incomplete;
        return (
            <View style={AssessmentStatus.styles.statusContainer}>
                <View style={AssessmentStatus.styles.textContainer}>
                    <Text style={[Typography.paperFontSubhead, AssessmentStatus.styles.textColor]}>
                        Assessment Status
                    </Text>
                    <Text style={[Typography.paperFontBody1, AssessmentStatus.styles.textColor]}>
                        {_.ceil(progressRatio * 100, 2)}% Complete
                    </Text>
                </View>
                {Platform.OS === 'android' ?
                    <ProgressBarAndroid
                        color={progressBarColor}
                        styleAttr="Horizontal" indeterminate={false}
                        progress={progressRatio}/> :
                    <ProgressViewIOS progressTintColor={progressBarColor} progress={progressRatio}/>
                }
            </View>
        );
    }
}

export default AssessmentStatus;