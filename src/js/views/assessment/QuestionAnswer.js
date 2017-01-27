import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {InputGroup, Input} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from '../../action';
import ListingItem from '../common/ListingItem';
import Typography from '../styles/Typography';
import Checkpoint from '../../models/Checkpoint';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class QuestionAnswer extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleOnPress = this.handleOnPress.bind(this);
        this.handleRemarks = this.handleRemarks.bind(this);
    }

    static styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
        },
        answerContainer: {
            backgroundColor: '#fafafa',
            alignSelf: 'stretch',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: PrimaryColors.light_black,
            marginTop: 1,
        },
        answer: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            margin: deviceWidth * .03833,
        },
        answerInfo: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignSelf: 'stretch'
        },
        compliance: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            alignSelf: 'stretch',
            marginTop: 8,
        },
        remarks: {
            alignSelf: 'stretch',
            marginTop: deviceHeight * .025
        },
        complianceItem: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: PrimaryColors.light_black,
            alignSelf: 'stretch',
            marginTop: deviceHeight * .01667,
            paddingTop: deviceHeight * .01667,
            paddingBottom: deviceHeight * .01667,
            paddingLeft: deviceWidth * .04,
            paddingRight: deviceWidth * .04,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            borderRadius: 2
        },
        activeCompliance: {
            backgroundColor: PrimaryColors.blue
        },
    });

    handleOnPress(score) {
        return () => this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
            checkpoint: Object.assign(this.props.checkpoint, {score: score})
        });
    }

    handleRemarks(remarks) {
        return this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
            checkpoint: Object.assign(this.props.checkpoint, {remarks: remarks})
        });
    }

    render() {
        const assessmentMethods = Checkpoint.getAssessmentMethods(this.props.checkpoint.checkpoint).join("/");
        const currentScore = this.props.checkpoint.score;
        //TODO: Mihir: Clean this bit up.
        const complianceItems = [["Non Compliant", 0], ["Partially Compliant", 1], ["Fully Compliant", 2]]
            .map(([text, score], idx) => (
                <TouchableWithoutFeedback key={idx} onPress={this.handleOnPress(score)}>
                    <View
                        style={[QuestionAnswer.styles.complianceItem,
                            score === currentScore ? QuestionAnswer.styles.activeCompliance : {}]}>
                        <Text style={[Typography.paperFontTitle, {
                            fontWeight: "400",
                            color: score === currentScore ? "white" : PrimaryColors.subheader_black
                        }]}>
                            {text}
                        </Text>
                        <Text
                            style={[Typography.paperFontDisplay1,
                                {color: score === currentScore ? "white" : PrimaryColors.subheader_black}]}>
                            {score}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>));

        return (
            <View style={QuestionAnswer.styles.container}>
                <ListingItem type='big' labelColor={PrimaryColors.lighBlue} item={this.props.checkpoint.checkpoint}/>
                <View style={QuestionAnswer.styles.answerContainer}>
                    <View style={QuestionAnswer.styles.answer}>
                        <View style={QuestionAnswer.styles.answerInfo}>
                            <Text style={[Typography.paperFontBody1, {color: PrimaryColors.blue}]}>
                                Means of Verification
                            </Text>
                            <Text style={[Typography.paperFontBody1, {color: PrimaryColors.subheader_black}]}>
                                {assessmentMethods}
                            </Text>
                        </View>
                        <View style={QuestionAnswer.styles.compliance}>
                            {complianceItems}
                        </View>
                        <View style={QuestionAnswer.styles.remarks}>
                            <InputGroup borderType='underline'>
                                <Input
                                    autoCorrect={true}
                                    value={this.props.checkpoint.remarks}
                                    onChangeText={this.handleRemarks}
                                    placeholder='Enter your comment here...'/>
                            </InputGroup>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default QuestionAnswer;