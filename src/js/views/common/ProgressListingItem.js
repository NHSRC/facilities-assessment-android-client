import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import _ from 'lodash';
import AbstractComponent from "../common/AbstractComponent";
import {Icon} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Fonts from "../styles/Fonts";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ProgressListingItem extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        button: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            margin: 0,
            marginTop: deviceHeight * .01667,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: PrimaryColors.light_black
        },
        small: {
            minHeight: deviceHeight * 0.06,
        },
        buttonTextBig: {
            fontFamily: Fonts.HelveticaNeueOrRobotoNoto,
            fontSize: 28,
            fontWeight: "400",
            lineHeight: 42
        },
        buttonText: {
            backgroundColor: "#fafafa",
            width: deviceWidth * 0.72,
            paddingLeft: deviceHeight * .02,
            margin: 0,
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        buttonLabel: {
            width: deviceWidth * 0.2,
            margin: 0,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        completeButtonContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        progressIndicator: {
            flex: 0.3,
            flexDirection: 'row-reverse',
        }
    });

    renderComplete() {
        return (
            <TouchableWithoutFeedback>
                <View style={ProgressListingItem.styles.completeButtonContainer}>
                    <Icon style={{color: PrimaryColors.blue}} name="md-checkmark-circle"/>
                </View>
            </TouchableWithoutFeedback>);
    }

    getProgress(item) {
        return `${item.progress.completed}/${item.progress.total}`;
    }

    renderProgress() {
        return (
            <Text style={[Typography.paperFontBody1, {
                color: "white"
            }]}>
                {_.isNumber(this.props.item.progress.total) ? this.getProgress(this.props.item) : ""}
            </Text>);
    }

    render() {
        const ProgressIndicator = _.isNumber(this.props.item.progress.total) &&
        this.props.item.progress.completed === this.props.item.progress.total ?
            this.renderComplete() : this.renderProgress();
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={[ProgressListingItem.styles.button, ProgressListingItem.styles.small]}>
                    <View style={[ProgressListingItem.styles.buttonLabel, {backgroundColor: this.props.labelColor}]}>
                        <Text style={[Typography.paperFontBody1, {color: "#FFF"}]}>
                            {this.props.item.reference}
                        </Text>
                        <View style={ProgressListingItem.styles.progressIndicator}>
                            {ProgressIndicator}
                        </View>
                    </View>
                    <View style={ProgressListingItem.styles.buttonText}>
                        <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                            {this.props.item.name}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }
}

export default ProgressListingItem;