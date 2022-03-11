import React from 'react';
import {Platform, StyleSheet, View, TextInput} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import {Button, Text, H3} from "native-base";
import PropTypes from "prop-types";
import Typography from "../../styles/Typography";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import SubmitButton from "../../common/SubmitButton";
import {LoginStatus} from "../../../action/submitAssessment";

class Login extends AbstractComponent {
    static propTypes = {
        userName: PropTypes.string,
        password: PropTypes.string,
        changedPassword: PropTypes.string,
        errorMessage: PropTypes.string,
        busy: PropTypes.bool
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
                <Text style={[Typography.paperFontTitle]}>For this assessment submission, login is required</Text>
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
            {this.props.errorMessage && <H3 style={{marginBottom: 20, color: 'red'}}>{this.props.errorMessage}</H3>}
            <SubmitButton onPress={() => {
                this.dispatchAction(Actions.LOGIN, {
                    successfulLogin: (assessmentNumbers) => this.dispatchAction(Actions.UPDATE_LOGIN_STATUS, {
                        loginStatus: LoginStatus.LOGGED_IN,
                        assessmentNumbers: assessmentNumbers
                    }),
                    loginFailed: (message) => this.dispatchAction(Actions.UPDATE_LOGIN_STATUS, {
                        loginStatus: LoginStatus.NOT_LOGGED_IN,
                        errorMessage: message,
                        assessmentNumbers: []
                    })
                });
            }} buttonText={'LOGIN'} busy={this.props.busy}/>
            <Button block
                    style={{flex: 0.5, marginTop: 20}}
                    onPress={() => this.dispatchAction(Actions.SUBMISSION_CANCELLED)}><Text>CANCEL</Text></Button>
        </View>
    }
}

export default Login;
