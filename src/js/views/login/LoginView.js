import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path, {PathRoot} from '../../framework/routing/Path';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginBox from './LoginBox';
import AbstractComponent from "../common/AbstractComponent";

@PathRoot
@Path("/login")
class LoginView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.state = context.getStore().getState().login;
        this.unsubscribe = context.getStore().subscribe(this.handleChange.bind(this));
    }

    handleChange() {
        this.setState(this.context.getStore().getState().login);
    }

    static styles = StyleSheet.create({
        loginViewContainer: {
            flex: 10,
            backgroundColor: PrimaryColors.background,
            alignItems: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        },
        loginHeader: {
            flex: 5,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        loginPadding: {
            flex: 1,
        }
    });

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <View style={LoginView.styles.loginViewContainer}>
                <View style={LoginView.styles.loginPadding}/>
                <View style={LoginView.styles.loginHeader}>
                    <Icon name="assessment" size={45} color={PrimaryColors.textBold}/>
                    <Text style={[Typography.paperFontDisplay1, {color: PrimaryColors.textBold}]}>Facilities
                        Assessment</Text>
                </View>
                <LoginBox username={this.state.username} password={this.state.password}/>
                <View style={LoginView.styles.loginPadding}/>
            </View>);
    }
}

export default LoginView;