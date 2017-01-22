import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Listing extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        listingContainer: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            marginTop: deviceHeight * 0.02,
        },
        listingButton: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            margin: 0,
            marginTop: deviceHeight * .01667,
            height: deviceHeight * 0.06,
        },
        listingButtonText: {
            backgroundColor: PrimaryColors.light_black,
            width: deviceWidth * 0.72,
            paddingLeft: deviceHeight * .02,
            margin: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        listingButtonLabel: {
            width: deviceWidth * 0.2,
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

    render() {
        const items = this.props.items.map((item, idx) =>
            <TouchableWithoutFeedback onPress={this.props.onPress(item)} key={idx}>
                <View style={Listing.styles.listingButton}>
                    <View style={Listing.styles.listingButtonText}>
                        <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                            {item.name}
                        </Text>
                    </View>
                    <View style={[Listing.styles.listingButtonLabel, {backgroundColor: this.props.labelColor}]}>
                        <Text style={[Typography.paperFontBody1, {color: "#FFF"}]}>
                            {item.reference}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);

        return (
            <View>
                {items}
            </View>
        );
    }
}

export default Listing;