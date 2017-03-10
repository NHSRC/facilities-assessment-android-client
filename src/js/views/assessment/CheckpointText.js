import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';

class CheckpointText extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        typo: {
            fontFamily: "Roboto,Noto,sans-serif",
            fontSize: 42,
            fontWeight: "500",
            letterSpacing: -0.018,
            lineHeight: 56
        }
    });

    render() {
        return (
            <Text style={[CheckpointText.styles.typo, {color: PrimaryColors.subheader_black}]}>
                {this.props.checkpoint.checkpoint.name}
            </Text>
        );
    }
}

export default CheckpointText;