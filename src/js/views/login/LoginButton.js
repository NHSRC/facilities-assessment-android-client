import React, {Component} from 'react';
import {TouchableHighlight, StyleSheet, View, Text} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import {Button, Icon} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';

class LoginButton extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        loginButton: {
            backgroundColor: PrimaryColors.textBold,
        }
    });

    render() {
        return (
            <Button onPress={()=>this.dispatchAction(Actions.LOGIN)}
                    style={LoginButton.styles.loginButton}
                    primary
                    block>
                <Icon name='input'/>
                Sign In
            </Button>
        );
    }
}

export default LoginButton;