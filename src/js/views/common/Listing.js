import React from 'react';
import {View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import ProgressListingItem from './ProgressListingItem';

class Listing extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const items = this.props.items.map((item, idx) =>
            <ProgressListingItem key={idx}
                                 item={item}
                                 onPress={this.props.onPress(item)}
                                 labelColor={this.props.labelColor}/>
        );
        return (
            <View>
                {items}
            </View>
        );
    }
}

export default Listing;