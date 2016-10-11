import React, {Component} from 'react';
import {TouchableHighlight, StyleSheet, View, Text} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PrimaryColors from '../styles/PrimaryColors';

class LoginButton extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        loginButtonContainer: {
            flex: 1,
            flexDirection: 'column',
            alignSelf: 'center',
        },
        loginButton: {
            flex: .7,
            backgroundColor: PrimaryColors.lightBlue,
        },
        loginButtonWrapper: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    });

    render() {
        return (
            <View style={LoginButton.styles.loginButtonContainer}>
                <View style={{flex: .15}}/>
                <TouchableHighlight
                    underlayColor={PrimaryColors.darkBlue}
                    style={LoginButton.styles.loginButton}
                    onPress={()=>this.dispatchAction(Actions.LOGIN)}>
                    <View style={LoginButton.styles.loginButtonWrapper}>
                        <Icon name="input" size={30} style={{paddingRight: 10}}/>
                        <Text>Sign In</Text>
                    </View>
                </TouchableHighlight>
                <View style={{flex: .15}}/>
            </View>);
    }
}

export default LoginButton;