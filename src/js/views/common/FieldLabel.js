import {StyleSheet, Text, View, Platform} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from './AbstractComponent';
import Typography from "../styles/Typography";

class FieldLabel extends AbstractComponent {
    static propTypes = {
        text: React.PropTypes.string.isRequired,
        style: React.PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Text style={[Platform.OS === 'ios' ? Typography.paperFontSubhead : Typography.paperFontTitle, this.props.style]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldLabel;