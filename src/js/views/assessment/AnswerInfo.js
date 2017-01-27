import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from '../styles/Typography';
import Checkpoint from '../../models/Checkpoint';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class AnswerInfo extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        answerInfo: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignSelf: 'stretch'
        },
    });

    render() {
        const assessmentMethods = Checkpoint.getAssessmentMethods(this.props.checkpoint.checkpoint).join("/");
        return (
            <View style={AnswerInfo.styles.answerInfo}>
                <Text style={[Typography.paperFontBody1, {color: PrimaryColors.blue}]}>
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