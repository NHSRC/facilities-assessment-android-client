import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView, ProgressBarAndroid as ProgressBar} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import moment from 'moment';

class AssessmentStatus extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        statusContainer: {
            marginTop: 26,
        },
        textContainer: {
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between"
        },
        textColor: {
            color: PrimaryColors.subheader_black
        },
    });

    render() {
        const progressRatio = this.props.completed / this.props.total;
        return (
            <View style={AssessmentStatus.styles.statusContainer}>
                <View style={AssessmentStatus.styles.textContainer}>
                    <Text style={[Typography.paperFontSubhead, AssessmentStatus.styles.textColor]}>
                        Assessment Status
                    </Text>
                    <Text style={[Typography.paperFontBody1, AssessmentStatus.styles.textColor]}>
                        {progressRatio * 100}% Complete
                    </Text>
                </View>
                <ProgressBar
                    color={progressRatio < 1 ? PrimaryColors.complete : PrimaryColors.incomplete}
                    styleAttr="Horizontal" indeterminate={false}
                    progress={progressRatio}/>
            </View>
        );
    }
}

export default AssessmentStatus;