import React from 'react';
import {Platform, StyleSheet, View, TextInput} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import {Button, Text} from "native-base";
import PropTypes from "prop-types";
import Typography from "../../styles/Typography";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import SubmitButton from "../../common/SubmitButton";

class Login extends AbstractComponent {
    static propTypes = {
        userName: PropTypes.string,
        password: PropTypes.string,
        changedPassword: PropTypes.string,
        changePasswordRequired: PropTypes.bool.isRequired
    };

    static styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            marginHorizontal: 10,
            flexDirection: 'column',
            padding: 20
        },
        input: {
            fontSize: 16,
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <View style={Login.styles.container}>
            <View style={{marginTop: 15, marginBottom: 30}}>
                <Text style={[Typography.paperFontTitle]}>For external assessment submission login is required</Text>
                <Text style={[Typography.paperFontSubhead, {marginTop: 20}]}>Email</Text>
                <TextInput style={Login.styles.input}
                    // value={}
                           underlineColorAndroid={PrimaryColors["grey"]}
                           words="words"
                           onChangeText={(text) => {
                               this.dispatchAction(Actions.CHANGE_LOGIN_DETAILS, {email: text})
                           }}/>
            </View>
            <View style={{marginBottom: 30}}>
                <Text style={[Typography.paperFontSubhead]}>Password</Text>
                <TextInput style={Login.styles.input}
                    // value={}
                           underlineColorAndroid={PrimaryColors["grey"]}
                           words="words"
                           secureTextEntry={true}
                           onChangeText={(text) => {
                               this.dispatchAction(Actions.CHANGE_LOGIN_DETAILS, {password: text})
                           }}/>
            </View>
            {this.props.changePasswordRequired && <View style={{marginBottom: 20}}>
                <Text style={[Typography.paperFontTitle]}>It is recommended that you change your password once</Text>
                <Text style={[Typography.paperFontSubhead]}>New Password</Text>
                <TextInput style={Login.styles.input}
                    // value={}
                           underlineColorAndroid={PrimaryColors["grey"]}
                           words="words"
                           secureTextEntry={true}
                           onChangeText={(text) => {
                               this.dispatchAction(Actions.CHANGE_LOGIN_DETAILS, {newPassword: text})
                           }}/>
            </View>}
            <SubmitButton onPress={() => this.dispatchAction(this.props.changePasswordRequired ? Actions.CHANGE_PASSWORD : Actions.LOGIN)}
                          buttonText={this.props.changePasswordRequired ? 'CHANGE PASSWORD' : 'LOGIN'}/>
            {this.props.changePasswordRequired && <Button block
                                                          style={{marginHorizontal: 10, flex: 0.5, marginTop: 20}}
                                                          onPress={() => this.close()}><Text>SKIP</Text></Button>}
        </View>
    }
}

export default Login;
