import React from 'react';
import {Alert, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import _ from 'lodash';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Toolbar extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.showMeansOfVerification = this.showMeansOfVerification.bind(this);
    }

    static styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flex: 1,
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            marginTop: deviceHeight * .01667,
        },
        yellowText: {
            color: PrimaryColors.yellow,
        },
        actionButtons: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
        },
        actionButton: {
            backgroundColor: PrimaryColors.blue,
            marginRight: 8,
            height: deviceHeight * 0.0375,
            width: deviceWidth * 0.175,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap'
        },
        actionButtonText: {
            color: 'white',
            alignSelf: 'center',
        },
    });

    isLast(currentCheckpoint, checkpoints) {
        return _.last(checkpoints).uuid === currentCheckpoint.uuid;
    }

    isNotLast(currentCheckpoint, checkpoints) {
        return !this.isLast(currentCheckpoint, checkpoints);
    }

    isNotFirst(currentCheckpoint, checkpoints) {
        return !this.isFirst(currentCheckpoint, checkpoints);
    }

    isFirst(currentCheckpoint, checkpoints) {
        return _.head(checkpoints).uuid === currentCheckpoint.uuid;
    }

    showFinished(currentCheckpoint, checkpoints) {
        return checkpoints.every(({score}) => _.isNumber(score));
    }

    getCurrentIndex() {
        return _.findIndex(this.props.checkpoints,
            (checkpoint) => this.props.currentCheckpoint.uuid === checkpoint.uuid);
    }

    onNext() {
        const nextCheckpoint = this.props.checkpoints[this.getCurrentIndex() + 1];
        this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: nextCheckpoint});
    }

    onPrev() {
        const prevCheckpoint = this.props.checkpoints[this.getCurrentIndex() - 1];
        this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: prevCheckpoint});
    }

    onFinish() {
        this.props.goBack();
    }

    renderButton(button, key) {
        const extraStyles = _.isEmpty(button.style) ? {} : button.style;
        return (
            <TouchableWithoutFeedback key={key} onPress={button.onPress}>
                <View style={[Toolbar.styles.actionButton, extraStyles]}>
                    <Text style={[Toolbar.styles.actionButtonText, Typography.paperFontBody1]}>
                        {button.label}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }


    showMeansOfVerification() {
        Alert.alert("Means of Verification", this.props.checkpoint.checkpoint.meansOfVerification);
    }

    render() {
        const ButtonsToRender = [
            {label: "PREV", onPress: this.onPrev.bind(this), doRender: this.isNotFirst.bind(this)},
            {label: "NEXT", onPress: this.onNext.bind(this), doRender: this.isNotLast.bind(this)},
            {label: "FINISH", onPress: this.onFinish.bind(this), doRender: this.showFinished.bind(this),
                style:{backgroundColor: PrimaryColors.complete}}
        ].filter((button) => button.doRender(this.props.currentCheckpoint, this.props.checkpoints))
            .map((button, key) => this.renderButton(button, key));
        let meansOfVerificationLink = _.isEmpty(this.props.checkpoint.checkpoint.meansOfVerification) ?
            (<View/>) :
            (<View>
                <Text
                    style={[Typography.paperFontBody1, {
                        fontWeight: '500',
                        color: PrimaryColors.yellow,
                        textDecorationLine: 'underline'
                    }]}>
                    Means of Verification
                </Text>
                <Text style={{color: "white"}}>
                    {this.props.checkpoint.checkpoint.meansOfVerification}
                </Text>
            </View>);
        return (
            <View style={Toolbar.styles.container}>
                <View style={{flex: 1, marginRight: 10}}>
                    {meansOfVerificationLink}
                </View>
                <View style={Toolbar.styles.actionButtons}>
                    {ButtonsToRender}
                </View>
            </View>
        );
    }
}

export default Toolbar;