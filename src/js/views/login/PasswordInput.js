import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import LoginTextInput from "./LoginTextInput";


class PasswordInput extends AbstractComponent {

    render() {
        return (
            <LoginTextInput
                icon="lock"
                placeholder={"Password"}
                onChange={(text)=> this.dispatchAction(Actions.ENTER_PASSWORD, {"password": text})}
                {...this.props}/>
        );
    }
}

export default PasswordInput;