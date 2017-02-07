import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
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
    });

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={[ProgressListingItem.styles.button, ProgressListingItem.styles.small]}>
                    <View style={ProgressListingItem.styles.buttonText}>
                        <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                            {this.props.item.name}
                        </Text>
                        <Text style={[Typography.paperFontBody1, {
                            color: PrimaryColors.subheader_black,
                            marginRight: deviceWidth * 0.02667
                        }]}>
                            {`${this.props.item.progress.completed}/${this.props.item.progress.total}`}
                        </Text>
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