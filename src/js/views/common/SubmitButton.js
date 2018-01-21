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
        let showButton = this.props.showButton ? this.props.showButton : true;
        return (
            <Button
                onPress={this.props.onPress}
                style={[SubmitButton.styles.blockButton, this.props.buttonStyle, showButton ?
                    {} : {backgroundColor: "rgba(0, 0, 0, 0.38)",}]}
                block
                disabled={!showButton}>
                {this.props.buttonText}
            </Button>
        );
    }
}

export default SubmitButton;
