import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import ListingItem from './ListingItem';

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
        }
    });

    render() {
        const items = this.props.items.map((item, idx) =>
            <ListingItem key={idx} item={item} onPress={this.props.onPress(item)} labelColor={this.props.labelColor}/>
        );
        return (
            <View>
                {items}
            </View>
        );
    }
}

export default Listing;