import React from 'react';
import {
    Dimensions, View, Text, StyleSheet,
    Alert, NativeModules
} from 'react-native';
import {Container, Content, Title, Button, Header, Icon} from 'native-base';
import ViewComponent from "../common/ViewComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import EnvironmentConfig from "../common/EnvironmentConfig";
import ErrorHandler from "../../utility/ErrorHandler";

const {Restart} = NativeModules;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/settings")
class Settings extends ViewComponent {
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
        buttons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30
        },
    });

    componentWillMount() {
        this.dispatchAction(Actions.INITIAL_SETTINGS);
    }

    _onBack() {
        this.dispatchAction(Actions.MODE_SELECTION);
    }

    alert(message) {
        Alert.alert(
            'Server Request Status',
            message,
            [
                {
                    text: 'OK', onPress: () => {
                    }
                }
            ]
        )
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
                        {EnvironmentConfig.isEmulated &&
                        <View>
                            <View style={Settings.styles.buttons}>
                                <Button style={{marginRight: 10}} onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    ErrorHandler.forceSet();
                                    Restart.crashForTesting();
                                }}>Native Crash</Button>
                                <Button style={{marginRight: 10}} onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    ErrorHandler.forceSet();
                                    ErrorHandler.simulateJSError();
                                }}>JS Exception</Button>
                                <Button onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    ErrorHandler.forceSet();
                                    ErrorHandler.simulateJSCallbackError();
                                }}>Callback Exception</Button>
                            </View>
                            <View style={Settings.styles.buttons}>
                                <Button onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    this.dispatchAction(Actions.SIMULATE_SERVER_ERROR, {noError: () => this.alert("No Error"), error: (error) => this.alert(JSON.stringify(error))});
                                }}>Server Request Error</Button>
                            </View>
                        </View>}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Settings;