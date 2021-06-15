import React from "react";
import {Dimensions, Platform, StyleSheet, TextInput} from "react-native";
import {CheckBox, H3, Text, View, Button} from "native-base";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";
import Logger from "../../framework/Logger";
import Actions from "../../action";
import PrimaryColors from "../styles/PrimaryColors";
import AbstractComponent from "../common/AbstractComponent";
import SubmitButton from "../common/SubmitButton";
import TypedTransition from "../../framework/routing/TypedTransition";
import GunakContainer from "../common/GunakContainer";
import ModeSelection from "../modes/ModeSelection";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/userProfile")
class UserProfile extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'userProfile');
    }

    componentWillMount() {
        this.dispatchAction(Actions.LAUNCH_USER_PROFILE);
    }

    static styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            marginHorizontal: 10,
            flexDirection: 'column',
            padding: 20
        },
        modeContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        mode: {
            backgroundColor: 'transparent',
        },
        highlight: {
            fontWeight: '900'
        },
        input: {
            fontSize: 16,
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

    render() {
        Logger.logDebug('UserProfile', 'render');
        return <GunakContainer title="User Profile" onHeaderButtonPress={() => TypedTransition.from(this).goBack()}>
            <View style={UserProfile.styles.container}>
                <View>
                    <Text style={[Typography.paperFontSubhead]}>Email</Text>
                    <Text style={[Typography.paperFontSubhead]}>{this.state.user.email}</Text>
                </View>
                <View style={{marginTop: 20}}>
                    <Text style={[Typography.paperFontSubhead]}>First name</Text>
                    <TextInput style={UserProfile.styles.input}
                               value={this.state.user.firstName}
                               underlineColorAndroid={PrimaryColors["grey"]}
                               words="words"
                               onChangeText={(text) => this.dispatchAction(Actions.UPDATE_USER, {firstName: text})}/>
                </View>
                <View style={{marginTop: 20}}>
                    <Text style={[Typography.paperFontSubhead]}>Last name</Text>
                    <TextInput style={UserProfile.styles.input}
                               value={this.state.user.lastName}
                               underlineColorAndroid={PrimaryColors["grey"]}
                               words="words"
                               onChangeText={(text) => this.dispatchAction(Actions.UPDATE_USER, {lastName: text})}/>
                </View>
                {!this.state.user.passwordChanged && <Text style={[Typography.paperFontTitle]}>It is recommended that you change your password once</Text>}
                <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <CheckBox checked={this.state.changingPassword} onPress={() => this.dispatchAction(Actions.CHANGING_PASSWORD)}/>
                    <Text style={{marginLeft: 20}}>Change password</Text>
                </View>
                {this.state.changingPassword && <View style={{marginTop: 20}}>
                    <Text style={[Typography.paperFontSubhead]}>Old Password</Text>
                    <TextInput style={UserProfile.styles.input}
                               value={this.state.user.oldPassword}
                               underlineColorAndroid={PrimaryColors["grey"]}
                               words="words"
                               secureTextEntry={true}
                               onChangeText={(text) => {
                                   this.dispatchAction(Actions.UPDATE_USER, {oldPassword: text})
                               }}/>
                </View>}
                {this.state.changingPassword && <View style={{marginTop: 20}}>
                    <Text style={[Typography.paperFontSubhead]}>New Password</Text>
                    <TextInput style={UserProfile.styles.input}
                               value={this.state.user.newPassword}
                               underlineColorAndroid={PrimaryColors["grey"]}
                               words="words"
                               secureTextEntry={true}
                               onChangeText={(text) => this.dispatchAction(Actions.UPDATE_USER, {newPassword: text})}/>
                </View>}
                {this.state.errorMessage && <H3 style={{marginTop: 20, color: 'red'}}>{this.state.errorMessage}</H3>}
                {this.state.successMessage && <H3 style={{marginTop: 20, color: 'green'}}>{this.state.successMessage}</H3>}
                <SubmitButton onPress={() => {
                    this.dispatchAction(Actions.SAVE_USER_PROFILE, {
                        userSaved: () => this.dispatchAction(Actions.UPDATE_SAVE_STATUS, {successMessage: "User profile saved!"}),
                        userSaveFailed: (message) => this.dispatchAction(Actions.UPDATE_SAVE_STATUS, {errorMessage: message})
                    });
                }} buttonText={'SUBMIT'} busy={this.state.busy}
                              buttonStyle={{marginTop: 20}}/>
                <Button block
                        style={{flex: 1, marginTop: 20}}
                        onPress={() => TypedTransition.from(this).to(ModeSelection)}><Text>CANCEL</Text></Button>
            </View>
        </GunakContainer>;
    }
}

export default UserProfile;
