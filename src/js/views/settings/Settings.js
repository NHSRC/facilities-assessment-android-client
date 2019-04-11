import React, {Component} from 'react';
import {
    Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, Image, TextInput,
    ActivityIndicator, Alert, Navigator, NativeModules
} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, InputGroup, Input} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import SubmitButton from '../common/SubmitButton';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import {formatDate} from '../../utility/DateUtils';
import EnvironmentConfig from "../common/EnvironmentConfig";
import SubmitAssessment from "../dashboard/open/SubmitAssessment";

const {Restart} = NativeModules;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/settings")
class Settings extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'settings');
    }

    static styles = StyleSheet.create({
        container: {
            margin: deviceWidth * 0.04,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        textBox: {
            alignSelf: 'stretch',
            marginTop: 8,
            marginBottom: 20
        },
    });

    componentWillMount() {
        this.dispatchAction(Actions.INITIAL_SETTINGS);
    }

    cleanData() {
        Alert.alert(
            'Do you want delete data',
            "This will remove the reference, configuration and transaction data.",
            [
                {
                    text: 'Yes', onPress: () => {
                        this.dispatchAction(Actions.CLEAN_DATA);
                    }
                },
                {
                    text: 'No', onPress: () => {
                    }
                }
            ]
        )
    }

    cleanTxData() {
        Alert.alert(
            'Do you want delete data',
            "This will remove the Tx data.",
            [
                {
                    text: 'Yes', onPress: () => {
                        this.dispatchAction(Actions.CLEAN_TXDATA);
                    }
                },
                {
                    text: 'No', onPress: () => {
                    }
                }
            ]
        )
    }

    _onBack() {
        this.dispatchAction(Actions.MODE_SELECTION);
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header style={FlatUITheme.header}>
                    <Button
                        onPress={() => {
                            this._onBack();
                            TypedTransition.from(this).goBack();
                        }}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>Settings</Title>
                </Header>
                <Content>
                    <View style={Settings.styles.container}>
                        <View style={Settings.styles.textBox}>
                            <Text
                                style={[Typography.paperFontTitle, {marginLeft: 8, color: PrimaryColors.medium_white}]}>
                                Server URL</Text>
                            <Text
                                style={[Typography.paperFontBody, {marginLeft: 8, color: PrimaryColors.medium_white}]}>{this.state.serverURL}</Text>
                        </View>
                        <View style={Settings.styles.textBox}>
                            <Text
                                style={[Typography.paperFontTitle, {marginLeft: 8, color: PrimaryColors.medium_white}]}>VERSION NUMBER</Text>
                            <Text
                                style={[Typography.paperFontBody, {marginLeft: 8, color: PrimaryColors.medium_white}]}>{EnvironmentConfig.versionCode}</Text>
                        </View>
                        {EnvironmentConfig.inDeveloperMode &&
                        <View style={Settings.styles.textBox}>
                            <Text
                                style={[Typography.paperFontTitle, {marginLeft: 8, color: PrimaryColors.medium_white}]}>Force Native Crash</Text>
                            <Button
                                onPress={() => Restart.crashForTesting()} transparent>
                                <Icon style={{marginTop: 10, color: 'white'}} name="alarm"/>
                            </Button>
                        </View>}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Settings;