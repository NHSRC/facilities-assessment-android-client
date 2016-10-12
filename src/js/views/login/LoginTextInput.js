import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import AbstractComponent from "../common/AbstractComponent";
import {InputGroup, Input, Icon} from 'native-base';

class LoginTextInput extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        loginTextInputContainer: {
            marginBottom: 20
        },
        loginTextInput: {
        }
    });

    static propTypes = {
        onChange: React.PropTypes.func.isRequired,
        data: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string.isRequired
    };

    render() {

        return (
            <InputGroup style={LoginTextInput.styles.loginTextInputContainer}>
                <Icon name={this.props.icon}/>
                <Input value={this.props.data} onChangeText={this.props.onChange} placeholder={this.props.placeholder}/>
            </InputGroup>
        );
    }
}

export default LoginTextInput;