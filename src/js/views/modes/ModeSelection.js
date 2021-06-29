import React from "react";
import {
    Alert,
    Dimensions,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableWithoutFeedback,
    Linking
} from "react-native";
import {Body, Button, Container, Content, Header, Icon, Left, StyleProvider, Title, Text, View, Right} from "native-base";
import ViewComponent from "../common/ViewComponent";
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";
import Dashboard from "../dashboard/Dashboard";
import Settings from "../settings/Settings";
import Logger from "../../framework/Logger";
import EnvironmentConfig from "../common/EnvironmentConfig";
import Actions from "../../action";
import StateSelection from "../initialSetup/StateSelection";
import _ from 'lodash';
import {Navigator} from 'react-native-deprecated-custom-components';
import getTheme from "../../native-base-theme/components";
import platformTheme from "../../native-base-theme/variables/platform";
import GunakButton from "../common/buttons/GunakButton";
import PrimaryColors from "../styles/PrimaryColors";
import PlatformIndependentProgressBar from "../progressBar/PlatformIndependentProgressBar";
import {MSLoginStatus} from "../../action/modeSelection";
import UserProfile from "../user/UserProfile";

const nqasIcon = require('../img/nqas.png');
const kayakalpIcon = require('../img/kayakalp.png');
const LaqshyaIcon = require('../img/Laqshya.png');
const nhsrcbanner = require('../img/nhsrcbanner.png');

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/modeSelection")
class ModeSelection extends ViewComponent {
    constructor(props, context) {
        super(props, context, 'modeSelection');
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    componentWillMount() {
        this.dispatchAction(Actions.MODE_SELECTION, {
            ...this.props.params, setLoginStatus: (status) => {
                this.dispatchAction(Actions.SET_LOGIN_STATUS, {loginStatus: status});
            }
        });
    }

    static styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: PrimaryColors.bodyBackground
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
        }
    });

    handleOnPress(mode) {
        return () => TypedTransition.from(this).with({mode: mode}).to(Dashboard);
    }

    getModeIfPresent(name, icon, padText = true) {
        let showMode = !_.isNil(this.state) && this.state.modes.indexOf(name.toUpperCase()) > -1;
        let paddingTop = padText ? deviceHeight * 0.1 : 0;
        return showMode ? (
            <TouchableWithoutFeedback onPress={this.handleOnPress(name)}>
                {icon ? <Image resizeMode="contain"
                               style={{
                                   maxHeight: 170,
                                   width: deviceWidth * .33,
                                   marginLeft: deviceWidth * .06,
                               }}
                               source={icon}/> :
                    <Text style={[Typography.paperFontHeadline, {
                        color: 'white',
                        width: deviceWidth * .4,
                        marginLeft: deviceWidth * .06,
                        paddingTop: paddingTop
                    }]}>{name}</Text>}
            </TouchableWithoutFeedback>
        ) : <View/>;
    }

    addNewState() {
        TypedTransition.from(this).with({chooseAdditional: true}).to(StateSelection);
    }

    downloadChecklistMetadata() {
        this.dispatchAction(Actions.DOWNLOAD_REFERENCE_DATA, {
            cb: () => this.downloadCompleted(),
            onError: (error) => this.downloadFailed(error)
        });

        let intervalID = setInterval(() => {
            if (!this.state.downloading)
                clearInterval(intervalID);
            this.dispatchAction(Actions.DOWNLOAD_PROGRESS);
        }, 1000);
    }

    downloadCompleted() {
        this.dispatchAction(Actions.DOWNLOAD_COMPLETED, {success: true});
    }

    downloadFailed(error) {
        Alert.alert("Download failed", error.message,
            [
                {
                    text: "OK",
                    onPress: () => {
                        this.dispatchAction(Actions.DOWNLOAD_COMPLETED, {success: false});
                    }
                }
            ],
            {cancelable: false}
        );
    }

    downloadMyAssessments() {
        this.dispatchAction(Actions.DOWNLOAD_MY_ASSESSMENTS, {cb: () => this.downloadCompleted(), onError: (error) => this.downloadFailed(error)});
        this.dispatchAction(Actions.DOWNLOAD_REFERENCE_DATA, {
            cb: () => this.downloadCompleted(),
            onError: (error) => this.downloadFailed(error)
        });
    }

    render() {
        Logger.logDebug('ModeSelection', 'render');
        return (
            <StyleProvider style={getTheme(platformTheme)}>
                <Container>
                    <Header style={{backgroundColor: PrimaryColors.header}}>
                        {EnvironmentConfig.isEmulated ?
                            <Left style={{flex: 0.1}}>
                                <Button
                                    onPress={() => TypedTransition.from(this)
                                        .with({
                                            cb: () => {
                                            }
                                        })
                                        .to(Settings, Navigator.SceneConfigs.FloatFromLeft)}
                                    transparent>
                                    <Icon style={{color: 'white'}} name="menu"/>
                                </Button></Left> : <View/>}
                        <Body style={{flexGrow: 1}}>
                            <Title style={[Typography.paperFontTitle, {
                                fontWeight: 'bold',
                                color: 'white',
                                alignSelf: 'flex-start',
                                marginLeft: 10
                            }]}>GUNAK (गुणक)</Title>
                        </Body>
                        {this.getRightActions()}
                    </Header>
                    <Content contentContainerStyle={ModeSelection.styles.container}>
                        <View style={[ModeSelection.styles.modeContainer]}>
                            {this.getModeIfPresent("NQAS", nqasIcon)}
                            {this.getModeIfPresent("Kayakalp", kayakalpIcon)}
                            {this.getModeIfPresent("Laqshya", LaqshyaIcon)}
                            {this.getModeIfPresent("Dakshata")}
                        </View>
                        <View style={[ModeSelection.styles.modeContainer]}>
                            {this.getModeIfPresent("ANC Program", null, false)}
                            {this.getModeIfPresent("Outcome Monitoring", null, false)}
                        </View>
                        {this.state.seedProgress && this.state.downloading && PlatformIndependentProgressBar.display(this.state.seedProgress.syncProgress, {marginTop: 2})}
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 60, flexWrap: 'wrap'}}>
                            <GunakButton style={{margin: 10}}
                                         info
                                         onPress={() => this.downloadChecklistMetadata()}><Text>{this.downloadButtonContent("Update Checklists/Facilities")}</Text></GunakButton>
                            <GunakButton style={{margin: 10}}
                                         info
                                         onPress={() => this.downloadMyAssessments()}><Text>{this.downloadButtonContent("Download My Assessments")}</Text></GunakButton>
                            {this.state.statesAvailableToBeLoaded ? <GunakButton style={{margin: 10}}
                                                                                 info
                                                                                 onPress={() => this.addNewState()}><Text>{this.downloadButtonContent("Add State")}</Text></GunakButton> : null}
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginVertical: 6,
                            flexWrap: 'wrap'
                        }}>
                            <Text style={{color: '#0096FF', fontWeight: 'bold'}}
                                  onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.facilitiesassessment&hl=en_IN&gl=US')}>
                                Mentor Assessment
                            </Text>
                            <Text style={{color: 'white', alignSelf: 'center', fontSize: 10}}>(You can download the
                                mentor assessment app from Google Playstore)</Text>
                        </View>

                        <Text style={[Typography.paperFontTitle, {
                            color: 'white',
                            alignSelf: 'center'
                        }]}>Support Email</Text>
                        <Text style={[Typography.paperFontTitle, {
                            color: 'skyblue',
                            alignSelf: 'center'
                        }]}>help@gunaknhsrc.freshdesk.com</Text>
                    </Content>
                    <Image resizeMode="contain" style={{width: deviceWidth}} source={nhsrcbanner}/>
                </Container>
            </StyleProvider>
        );
    }

    getRightActions() {
        return this.state.loginStatus !== MSLoginStatus.MS_NOT_LOGGED_IN && <Right style={{flex: 0.16}}>
            {this.state.loginStatus === MSLoginStatus.MS_LOGGED_IN ?
                <>
                    <Button transparent><Icon style={{color: 'white'}} name="person" onPress={() => TypedTransition.from(this).to(UserProfile)}/></Button>
                    <Button transparent><Icon style={{color: 'white'}} name="log-out"
                                              onPress={() => this.dispatchAction(Actions.LOGOUT, {
                                                  loggedOut: () => this.dispatchAction(Actions.SET_LOGIN_STATUS, {loginStatus: MSLoginStatus.MS_NOT_LOGGED_IN})
                                              })}/></Button></> :
                <ActivityIndicator animating={true} size={"small"} color="white" style={{height: 20}}/>}
        </Right>;
    }

    downloadButtonContent(normalText) {
        return this.state.downloading ?
            <Text style={[Typography.paperFontSubhead, {color: 'gray'}]}>{"Downloading..."}</Text> :
            <Text style={[Typography.paperFontSubhead, {color: 'white'}]}>{normalText}</Text>;
    }
}

export default ModeSelection;
