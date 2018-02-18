import React, {Component} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
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
        let assessmentMethods = Checkpoint.getAssessmentMethods(this.props.checkpoint.checkpoint);
        return (
            <View style={AnswerInfo.styles.answerInfo}>
                <Text style={[Typography.paperFontBody1, {color: PrimaryColors.caption_black}]}>
                    CHECKPOINT
                </Text>
                {assessmentMethods.length === 0 ? <View/> :
                    <View style={{
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: "black",
                        padding: 1
                    }}>
                        <Text style={[Typography.paperFontTitle, {
                            color: 'black', fontWeight: '900'
                        }]}>
                            {assessmentMethods.join("/")}
                        </Text>
                    </View>}
            </View>
        );
    }
}

export default AnswerInfo;