import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView, ProgressBarAndroid as ProgressBar} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import moment from 'moment';

class AssessmentStatus extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <View style={{backgroundColor: PrimaryColors.textBold}}>
                <Text style={{alignSelf: 'center', fontSize: 21, color: PrimaryColors.background}}>Assessment
                    Status</Text>
                <Text style={{alignSelf: 'center', fontSize: 18, color: PrimaryColors.background}}>Assessment
                    last updated on {moment(this.props.assessment.dateUpdated).format("Do MMM YY")}</Text>

                <ProgressBar
                    color={this.props.progressRatio < .9 ? PrimaryColors.red : PrimaryColors.background}
                    styleAttr="Horizontal" indeterminate={false}
                    progress={this.props.progressRatio}/>

                <Text style={{alignSelf: 'center', fontSize: 18, color: PrimaryColors.background}}>Checkpoints
                    Completed: {this.props.progress.completed}/{this.props.progress.total}</Text>


                <ProgressBar
                    style={{marginBottom: 10}}
                    color={this.props.progressRatio < .9 ? PrimaryColors.red : PrimaryColors.background}
                    styleAttr="Horizontal" indeterminate={false}
                    progress={this.props.progressRatio}/>
            </View>
        );
    }
}

export default AssessmentStatus;