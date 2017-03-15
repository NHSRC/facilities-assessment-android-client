import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import _ from 'lodash';
import AbstractComponent from "../common/AbstractComponent";
import {Icon} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";


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
        small: {height: deviceHeight * 0.06,},
        buttonTextBig: {
            fontFamily: "Roboto,Noto,sans-serif",
            fontSize: 28,
            fontWeight: "400",
            lineHeight: 42
        },
        buttonText: {
            backgroundColor: "#fafafa",
            width: deviceWidth * 0.72,
            paddingLeft: deviceHeight * .02,
            margin: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        buttonLabel: {
            width: deviceWidth * 0.2,
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center'
        },
        completeButtonContainer: {
            backgroundColor: PrimaryColors.light_black,
            borderRadius: 100,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: deviceWidth * 0.18,
            height: deviceHeight * .033,
            alignItems: 'center',
            marginRight: deviceWidth * 0.02667
        }
    });

    renderComplete() {
        return (
            <TouchableWithoutFeedback>
                <View style={ProgressListingItem.styles.completeButtonContainer}>
                    <Icon style={{color: PrimaryColors.yellow}} name="check-circle"/>
                    <Text style={{marginLeft: 5}}>Complete</Text>
                </View>
            </TouchableWithoutFeedback>);
    }

    getProgress(item) {
        return `${item.progress.completed}/${item.progress.total}`;
    }

    renderProgress() {
        return (
            <Text style={[Typography.paperFontBody1, {
                color: PrimaryColors.subheader_black,
                marginRight: deviceWidth * 0.02667
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
                    <View style={ProgressListingItem.styles.buttonText}>
                        <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                            {this.props.item.name}
                        </Text>
                        {ProgressIndicator}
                    </View>
                    <View style={[ProgressListingItem.styles.buttonLabel, {backgroundColor: this.props.labelColor}]}>
                        <Text style={[Typography.paperFontBody1, {color: "#FFF"}]}>
                            {this.props.item.reference}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }
}

export default ProgressListingItem;