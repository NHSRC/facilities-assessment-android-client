import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ListingItem extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        button: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            margin: 0,
            marginTop: deviceHeight * .01667,
        },
        big: {height: deviceHeight * 0.125,},
        small: {height: deviceHeight * 0.06,},
        buttonText: {
            backgroundColor: PrimaryColors.light_black,
            width: deviceWidth * 0.72,
            paddingLeft: deviceHeight * .02,
            margin: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
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
        const style = {
            big: {
                button: ListingItem.styles.big,
                text: Typography.paperFontTitle,
                label: Typography.paperFontHeadline
            },
            small: {
                button: ListingItem.styles.small,
                text: Typography.paperFontSubhead,
                label: Typography.paperFontBody1
            }
        }[(this.props.type || "small")];
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={[ListingItem.styles.button, style.button]}>
                    <View style={ListingItem.styles.buttonText}>
                        <Text style={[style.text, {color: PrimaryColors.subheader_black}]}>
                            {this.props.item.name}
                        </Text>
                    </View>
                    <View style={[ListingItem.styles.buttonLabel, {backgroundColor: this.props.labelColor}]}>
                        <Text style={[style.label, {color: "#FFF"}]}>
                            {this.props.item.reference}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }
}

export default ListingItem;