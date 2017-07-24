import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, Switch} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import CheckpointText from './CheckpointText';
import ListingItem from '../common/ListingItem';
import Compliance from './Compliance';
import Remarks from './Remarks';
import AnswerInfo from './AnswerInfo';
import Toolbar from './Toolbar';
import Actions from '../../action';
import Typography from '../styles/Typography';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class QuestionAnswer extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.updateCheckpoint = this.updateCheckpoint.bind(this);
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

    updateCheckpoint(checkpoint, updateObj, fn) {
        return () => {
            if (!_.isNumber(checkpoint.score) && updateObj.hasOwnProperty('score')) {
                [
                    Actions.UPDATE_STANDARD_PROGRESS,
                    Actions.UPDATE_AREA_OF_CONCERN_PROGRESS,
                    Actions.UPDATE_CHECKLIST_PROGRESS
                ].map((action) => this.dispatchAction(action, {...this.props.params}));
            }

            this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
                checkpoint: Object.assign(checkpoint, updateObj),
                ...this.props.params
            });
            fn();
        };
    }


    render() {
        const MeasurableElement = new Map([
            ["kayakalp", (<View/>)],
            ["nqas", (
                <ListingItem labelColor={PrimaryColors.lighBlue}
                             item={this.props.currentCheckpoint.checkpoint.measurableElement}/>)]
        ]).get(this.props.params.mode.toLowerCase());

        const isNotApplicable = _.isBoolean(this.props.currentCheckpoint.na) && this.props.currentCheckpoint.na;
        const NA = this.props.currentCheckpoint.checkpoint.optional ? (
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                    marginBottom: 10
                }}>
                    <Text
                        style={[Typography.paperFontBody1,
                            {
                                color: isNotApplicable ? PrimaryColors.red : PrimaryColors.caption_black,
                                fontWeight: isNotApplicable ? '900' : '400'
                            }]}>
                        {`${isNotApplicable ? "Not" : ""} Applicable`}
                    </Text>
                    <Switch thumbTintColor={isNotApplicable ? PrimaryColors.red : PrimaryColors.blue}
                            tintColor={PrimaryColors.blue}
                            onTintColor={PrimaryColors.red}
                            onValueChange={(value) => this.updateCheckpoint(this.props.currentCheckpoint, {
                                na: value,
                                score: null
                            }, _.noop)()}
                            value={isNotApplicable}/>
                </View>)
            : (<View/>);

        


        const ShowCompliance = _.isBoolean(this.props.currentCheckpoint.na) && this.props.currentCheckpoint.na ? (
                <View/>) :
            (<View>
                <Compliance updateCheckpoint={this.updateCheckpoint}
                            checkpoint={this.props.currentCheckpoint} {...this.props}/>
                <Remarks checkpoint={this.props.currentCheckpoint} {...this.props}/>
            </View>);
        return (
            <View style={QuestionAnswer.styles.container}>
                {MeasurableElement}
                <View style={QuestionAnswer.styles.answerContainer}>
                    <View style={QuestionAnswer.styles.answer}>
                        {NA}
                        <AnswerInfo checkpoint={this.props.currentCheckpoint}/>
                        <CheckpointText checkpoint={this.props.currentCheckpoint}/>
                        {ShowCompliance}
                    </View>
                </View>
                <Toolbar checkpoint={this.props.currentCheckpoint} {...this.props}/>
            </View>
        );
    }
}

export default QuestionAnswer;