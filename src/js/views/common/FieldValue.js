import {StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from './AbstractComponent';
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";

class FieldValue extends AbstractComponent {
    static propTypes = {
        text: React.PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.complete}]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldValue;