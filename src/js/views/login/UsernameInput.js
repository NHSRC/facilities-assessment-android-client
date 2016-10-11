import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import LoginTextInput from "./LoginTextInput";


class UsernameInput extends AbstractComponent {

    render() {
        return (
            <LoginTextInput
                icon="person"
                placeholder={"Username"}
                onChange={(text)=> this.dispatchAction(Actions.ENTER_USERNAME, {"username": text})}
                {...this.props} />
        );
    }
}

export default UsernameInput;