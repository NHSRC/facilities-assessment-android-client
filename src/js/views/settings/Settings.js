import React from 'react';
import {Alert, Dimensions, NativeModules, StyleSheet, Text, View} from 'react-native';
import {Button, Container, Content, Header, Icon, Title} from 'native-base';
import ViewComponent from "../common/ViewComponent";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import EnvironmentConfig from "../common/EnvironmentConfig";
import ErrorHandler from "../../utility/ErrorHandler";
import GunakContainer from "../common/GunakContainer";

const {Restart} = NativeModules;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import RNRestart from 'react-native-restart';

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
        settingButton:{
            marginRight: 10,
            paddingLeft:5,
            paddingRight:5
        }
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
            <GunakContainer title="Settings">
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
                                <Button style={Settings.styles.settingButton} onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    ErrorHandler.forceSet();
                                    Restart.crashForTesting();
                                }}><Text>Native Crash</Text></Button>
                                <Button style={Settings.styles.settingButton} onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    ErrorHandler.forceSet();
                                    ErrorHandler.simulateJSError();
                                }}><Text>JS Exception</Text></Button>
                                <Button style={Settings.styles.settingButton} onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    ErrorHandler.forceSet();
                                    ErrorHandler.simulateJSCallbackError();
                                }}><Text>Callback Exception</Text></Button>
                            </View>
                            <View style={Settings.styles.buttons}>
                                <Button style={Settings.styles.settingButton} onPress={() => {
                                    console.log("ENV property value should be qa or prod");
                                    this.dispatchAction(Actions.SIMULATE_SERVER_ERROR, {noError: () => this.alert("No Error"), error: (error) => this.alert(JSON.stringify(error))});
                                }}><Text>Server Request Error</Text></Button>
                            </View>
                            <View style={Settings.styles.buttons}>
                                <Button style={Settings.styles.settingButton} onPress={() => {
                                    console.log("Should restart");
                                    RNRestart.Restart();
                                }}><Text>RESTART APP</Text></Button>
                            </View>
                        </View>}
                    </View>
                </Content>
            </GunakContainer>
        );
    }
}

export default Settings;