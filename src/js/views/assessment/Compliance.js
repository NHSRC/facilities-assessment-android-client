import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, ToastAndroid} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import _ from 'lodash';
import ComplianceItem from './ComplianceItem';

class Compliance extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleOnPress = this.handleOnPress.bind(this);
        this.remarkNotif = this.remarkNotif.bind(this);
    }

    static styles = StyleSheet.create({
        compliance: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 8,
        },
    });


    getCurrentIndex() {
        return _.findIndex(this.props.checkpoints,
            (checkpoint) => this.props.currentCheckpoint.uuid === checkpoint.uuid);
    }

    next() {
        const nextCheckpoint = this.props.checkpoints[this.getCurrentIndex() + 1];
        this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: nextCheckpoint});
    }

    handleOnPress(score, fn) {
        return () => {
            if (!_.isNumber(this.props.checkpoint.score)) {
                [
                    Actions.UPDATE_STANDARD_PROGRESS,
                    Actions.UPDATE_AREA_OF_CONCERN_PROGRESS,
                    Actions.UPDATE_CHECKLIST_PROGRESS
                ].map((action) => this.dispatchAction(action, {...this.props.params}));
            }

            this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
                checkpoint: Object.assign(this.props.checkpoint, {score: score}),
                ...this.props.params
            });
            fn();
        }
    }

    remarkNotif() {
        ToastAndroid.showWithGravity("Please enter a remark", ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    render() {
        const currentScore = this.props.checkpoint.score;
        const complianceItems = [["Non Compliant", 0, this.remarkNotif], ["Partially Compliant", 1, this.remarkNotif], ["Fully Compliant", 2, _.noop]]
            .map(([text, score, fn], idx) => (
                <ComplianceItem key={idx} score={score} text={text} handleOnPress={this.handleOnPress(score, fn)}
                                active={currentScore === score}/>
            ));
        return (
            <View style={Compliance.styles.compliance}>
                {complianceItems}
            </View>
        );
    }
}

export default Compliance;