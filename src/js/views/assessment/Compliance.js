import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import ComplianceItem from './ComplianceItem';

class Compliance extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    static styles = StyleSheet.create({
        compliance: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            alignSelf: 'stretch',
            marginTop: 8,
        },
    });

    handleOnPress(score) {
        return () => {
            this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
                checkpoint: Object.assign(this.props.checkpoint, {score: score}),
            });
            this.dispatchAction(Actions.UPDATE_PROGRESS, {
                ...this.props.params
            });
        }
    }

    render() {
        const currentScore = this.props.checkpoint.score;
        const complianceItems = [["Non Compliant", 0], ["Partially Compliant", 1], ["Fully Compliant", 2]]
            .map(([text, score], idx) => (
                <ComplianceItem key={idx} score={score} text={text} handleOnPress={this.handleOnPress(score)}
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