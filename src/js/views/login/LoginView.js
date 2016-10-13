import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path, {PathRoot} from '../../framework/routing/Path';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginBox from './LoginBox';
import AbstractComponent from "../common/AbstractComponent";
import TypedTransition from "../../framework/routing/TypedTransition";
import FacilitySelection from "../facilitySelection/FacilitySelection";

@PathRoot
@Path("/login")
class LoginView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().login;
        this.unsubscribe = store.subscribe(this.handleChange.bind(this));
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

    handleChange() {
        const newState = this.context.getStore().getState().login;
        new Map([[true, this.changeView.bind(this)], [false, this.updateState.bind(this)]]).get(newState.isAuthenticated)(newState);
    }

    updateState(newState) {
        this.setState(newState);
    }

    changeView() {
        TypedTransition.from(this).resetTo(FacilitySelection);
    }

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