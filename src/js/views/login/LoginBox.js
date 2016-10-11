import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PrimaryColors from '../styles/PrimaryColors';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import Typography from '../styles/Typography';
import AbstractComponent from "../common/AbstractComponent";
import LoginButton from './LoginButton';


class LoginBox extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        loginBoxContainer: {
            flex: 3,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'stretch',
        },
    });

    render() {
        return (
            <View style={LoginBox.styles.loginBoxContainer}>
                <UsernameInput data={this.props.username}/>
                <PasswordInput data={this.props.password}/>
                <LoginButton/>
            </View>
        );
    }
}

export default LoginBox;