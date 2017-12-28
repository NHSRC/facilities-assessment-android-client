import React, {Component} from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Button} from 'native-base';
import {StyleSheet} from 'react-native';
import PrimaryColors from "../styles/PrimaryColors";

class SubmitButton extends AbstractComponent {
    static styles = StyleSheet.create({
        blockButton: {
            backgroundColor: PrimaryColors.blue,
        },
    });

    render() {
        return (
            <Button
                onPress={this.props.onPress}
                style={[SubmitButton.styles.blockButton, this.props.buttonStyle, this.props.showButton ?
                    {} : {backgroundColor: "rgba(0, 0, 0, 0.38)",}]}
                block
                disabled={!this.props.showButton}>
                {this.props.buttonText}
            </Button>
        );
    }
}

export default SubmitButton;
