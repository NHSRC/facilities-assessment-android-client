import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import CheckpointText from './CheckpointText';
import ListingItem from '../common/ListingItem';
import Compliance from './Compliance';
import Remarks from './Remarks';
import AnswerInfo from './AnswerInfo';
import Toolbar from './Toolbar';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class QuestionAnswer extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
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
    });

    render() {
        const MeasurableElement = new Map([
            ["kayakalp", (<View/>)],
            ["nqas", (
                <ListingItem labelColor={PrimaryColors.lighBlue}
                             item={this.props.currentCheckpoint.checkpoint.measurableElement}/>)]
        ]).get(this.props.params.mode.toLowerCase());
        return (
            <View style={QuestionAnswer.styles.container}>
                {MeasurableElement}
                <View style={QuestionAnswer.styles.answerContainer}>
                    <View style={QuestionAnswer.styles.answer}>
                        <AnswerInfo checkpoint={this.props.currentCheckpoint}/>
                        <CheckpointText checkpoint={this.props.currentCheckpoint}/>
                        <Compliance checkpoint={this.props.currentCheckpoint} {...this.props}/>
                        <Remarks checkpoint={this.props.currentCheckpoint} {...this.props}/>
                    </View>
                </View>
                <Toolbar checkpoint={this.props.currentCheckpoint} {...this.props}/>
            </View>
        );
    }
}

export default QuestionAnswer;