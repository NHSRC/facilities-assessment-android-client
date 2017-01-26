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
            height: deviceHeight * 0.06,
        },
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
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={ListingItem.styles.button}>
                    <View style={ListingItem.styles.buttonText}>
                        <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                            {this.props.item.name}
                        </Text>
                    </View>
                    <View style={[ListingItem.styles.buttonLabel, {backgroundColor: this.props.labelColor}]}>
                        <Text style={[Typography.paperFontBody1, {color: "#FFF"}]}>
                            {this.props.item.reference}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }
}

export default ListingItem;