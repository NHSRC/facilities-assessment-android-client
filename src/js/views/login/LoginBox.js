import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PrimaryColors from '../styles/PrimaryColors';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import Typography from '../styles/Typography';
import {Container, Content, List} from 'native-base';
import FlatUITheme from '../themes/flatUI';
import AbstractComponent from "../common/AbstractComponent";
import LoginButton from './LoginButton';


class LoginBox extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        loginBoxContainer: {
            flex: 3,
        },
    });

    render() {
        return (
            <Container style={LoginBox.styles.loginBoxContainer}>
                <Content theme={FlatUITheme}>
                    <List>
                        <UsernameInput data={this.props.username}/>
                        <PasswordInput data={this.props.password}/>
                        <LoginButton/>
                    </List>
                </Content>
            </Container>
        );
    }
}

export default LoginBox;