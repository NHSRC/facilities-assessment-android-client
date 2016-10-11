import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import AbstractComponent from "../common/AbstractComponent";
import Icon from 'react-native-vector-icons/MaterialIcons';

class LoginTextInput extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {"icon": ""};
    }

    componentWillMount() {
        Icon.getImageSource(this.props.icon, 35, 'black').then((source)=> {
            console.log("Called");
            this.setState({icon: source.uri});
            console.log(this.state.icon);
        });
    }

    static styles = StyleSheet.create({
        loginTextInputContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        loginTextInput: {
            flex: .9,
            alignSelf: 'stretch',
            color: PrimaryColors.textBold,
            paddingBottom: 0,
        },
        loginTextIcon: {
            flex: .1,
            alignSelf: 'flex-start',
            paddingTop: 20
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
            <View style={LoginTextInput.styles.loginTextInputContainer}>
                <Icon name={this.props.icon} size={35} style={LoginTextInput.styles.loginTextIcon}/>
                <TextInput
                    clearButtonMode="while-editing"
                    underlineColorAndroid={PrimaryColors.darkBlue}
                    style={LoginTextInput.styles.loginTextInput}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={PrimaryColors.lightBlue}
                    autoCorrect={false}
                    onChangeText={this.props.onChange}
                    value={this.props.data}
                />
            </View>
        );
    }
}

export default LoginTextInput;