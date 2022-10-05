import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
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
        const checkpoint = this.props.checkpoint.checkpoint;
        let assessmentMethods = Checkpoint.getAssessmentMethods(checkpoint);
        const title = _.isEmpty(checkpoint.themes) ?
                "CHECKPOINT" :
                `CHECKPOINT ${checkpoint.themes.map((t) => t.name).join(",")}`;
        return (
            <View style={AnswerInfo.styles.answerInfo}>
                <Text style={[Typography.paperFontBody1, {color: PrimaryColors.caption_black}]}>
                    {title}
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
