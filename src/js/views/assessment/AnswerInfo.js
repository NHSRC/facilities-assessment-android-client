import React, {Component} from 'react';
import {Dimensions, View, Text, StyleSheet, Alert} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from '../styles/Typography';
import Checkpoint from '../../models/Checkpoint';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class AnswerInfo extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.showMeansOfVerification = this.showMeansOfVerification.bind(this);
    }

    static styles = StyleSheet.create({
        answerInfo: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignSelf: 'stretch'
        },
    });

    showMeansOfVerification() {
        if (!_.isEmpty(this.props.checkpoint.checkpoint.meansOfVerification)) {
            Alert.alert("Means of Verification", this.props.checkpoint.checkpoint.meansOfVerification);
        }
    }

    render() {
        const assessmentMethods = Checkpoint.getAssessmentMethods(this.props.checkpoint.checkpoint).join("/");
        return (
            <View style={AnswerInfo.styles.answerInfo}>
                <Text onPress={this.showMeansOfVerification}
                      style={[Typography.paperFontBody1, {color: PrimaryColors.blue}]}>
                    Means of Verification
                </Text>
                <Text style={[Typography.paperFontBody1, {color: PrimaryColors.subheader_black}]}>
                    {assessmentMethods}
                </Text>
            </View>

        );
    }
}

export default AnswerInfo;