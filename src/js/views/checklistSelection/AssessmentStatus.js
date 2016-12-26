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
        const progressRatio = this.props.total / this.props.completed;
        return (
            <View style={{backgroundColor: PrimaryColors.textBold, alignSelf: 'stretch'}}>
                <Text style={{alignSelf: 'center', fontSize: 21, color: PrimaryColors.background}}>Assessment
                    Status</Text>

                <Text style={{alignSelf: 'center', fontSize: 18, color: PrimaryColors.background}}>Assessment
                    last updated on {moment(this.props.dateUpdated).format("Do MMM YY")}</Text>

                <ProgressBar
                    color={progressRatio < 1 ? PrimaryColors.red : PrimaryColors.background}
                    styleAttr="Horizontal" indeterminate={false}
                    progress={progressRatio}/>

                <Text style={{alignSelf: 'center', fontSize: 18, color: PrimaryColors.background}}>Checklists
                    Completed: {this.props.completed}/{this.props.total}</Text>


                <ProgressBar
                    style={{marginBottom: 10}}
                    color={progressRatio < 1 ? PrimaryColors.red : PrimaryColors.background}
                    styleAttr="Horizontal" indeterminate={false}
                    progress={progressRatio}/>
            </View>
        );
    }
}

export default AssessmentStatus;