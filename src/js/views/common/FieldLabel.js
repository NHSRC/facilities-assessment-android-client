import {StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from './AbstractComponent';
import PrimaryColors from "../styles/PrimaryColors";
import Fonts from "../styles/Fonts";

class FieldLabel extends AbstractComponent {
    static propTypes = {
        text: React.PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        typo: {
            fontFamily: Fonts.HelveticaNeueOrRobotoNoto,
            fontSize: 42,
            fontWeight: "500",
            letterSpacing: -0.018,
            lineHeight: 56
        }
    });

    render() {
        return (
            <Text style={[FieldLabel.styles.typo, {color: PrimaryColors.subheader_black}]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldLabel;