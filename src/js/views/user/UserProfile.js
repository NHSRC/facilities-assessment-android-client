import React from "react";
import {Dimensions, Platform, StyleSheet, TextInput} from "react-native";
import {Body, Container, CheckBox, Content, Header, StyleProvider, Title, View, Text} from "native-base";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";
import Logger from "../../framework/Logger";
import Actions from "../../action";
import getTheme from "../../native-base-theme/components";
import platformTheme from "../../native-base-theme/variables/platform";
import PrimaryColors from "../styles/PrimaryColors";
import AbstractComponent from "../common/AbstractComponent";

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
        return <StyleProvider style={getTheme(platformTheme)}>
            <Container>
                <Header style={{backgroundColor: PrimaryColors.header}}>
                    <Body style={{flexGrow: 1}}>
                        <Title style={[Typography.paperFontTitle, {
                            fontWeight: 'bold',
                            color: 'white',
                            alignSelf: 'flex-start',
                            marginLeft: 10
                        }]}>User Profile</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={UserProfile.styles.container}>
                    <View style={{marginTop: 15, marginBottom: 30}}>
                        <Text style={[Typography.paperFontSubhead, {marginTop: 20}]}>Email</Text>
                        <Text style={[Typography.paperFontSubhead, {marginTop: 20}]}>{this.state.user.email}</Text>
                    </View>
                    <View style={{marginTop: 15, marginBottom: 30}}>
                        <Text style={[Typography.paperFontSubhead, {marginTop: 20}]}>First name</Text>
                        <TextInput style={UserProfile.styles.input}
                            // value={}
                                   underlineColorAndroid={PrimaryColors["grey"]}
                                   words="words"
                                   onChangeText={(text) => this.dispatchAction(Actions.UPDATE_USER, {firstName: text})}/>
                    </View>
                    <View style={{marginTop: 15, marginBottom: 30}}>
                        <Text style={[Typography.paperFontSubhead, {marginTop: 20}]}>Last name</Text>
                        <TextInput style={UserProfile.styles.input}
                            // value={}
                                   underlineColorAndroid={PrimaryColors["grey"]}
                                   words="words"
                                   onChangeText={(text) => {
                                       this.dispatchAction(Actions.UPDATE_USER, {lastName: text})
                                   }}/>
                    </View>
                    <View style={{marginBottom: 20}}>
                        <CheckBox checked={this.state.changingPassword} onPress={() => {}}/>
                        <Text>Change password</Text>
                    </View>
                    {!this.state.user.passwordChanged && <Text style={[Typography.paperFontTitle]}>It is recommended that you change your password once</Text>}
                    <View style={{marginBottom: 20}}>
                        <Text style={[Typography.paperFontSubhead]}>New Password</Text>
                        <TextInput style={UserProfile.styles.input}
                            // value={}
                                   underlineColorAndroid={PrimaryColors["grey"]}
                                   words="words"
                                   secureTextEntry={true}
                                   onChangeText={(text) => {
                                       this.dispatchAction(Actions.UPDATE_USER, {newPassword: text})
                                   }}/>
                    </View>
                </Content>
            </Container>
        </StyleProvider>;
    }
}

export default UserProfile;
