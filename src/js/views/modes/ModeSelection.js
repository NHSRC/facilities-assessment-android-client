import React from "react";
import {ActivityIndicator, Alert, Dimensions, Image, Navigator, StyleSheet, Text, TouchableNativeFeedback, TouchableWithoutFeedback, View} from "react-native";
import {Button, Container, Content, Footer, Header, Icon, Title} from "native-base";
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from "../themes/flatUI";
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

const nqasIcon = require('../img/nqas.png');
const kayakalpIcon = require('../img/kayakalp.png');
const LaqshyaIcon = require('../img/Laqshya.png');
const nhsrcbanner = require('../img/nhsrcbanner.png');

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/modeSelection")
class ModeSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'modeSelection');
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    componentWillMount() {
        this.dispatchAction(Actions.MODE_SELECTION, {...this.props.params})
    }

    static styles = StyleSheet.create({
        container: {
            flexDirection: 'column'
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

    getMode(name, icon) {
        let showMode = !_.isNil(this.state) && this.state.modes.indexOf(name.toUpperCase()) > -1;
        return showMode ? (
            <TouchableWithoutFeedback onPress={this.handleOnPress(name)}>
                {icon ? <Image resizeMode="contain"
                               style={{
                                   maxHeight: 170,
                                   width: deviceWidth * .33,
                                   marginLeft: deviceWidth * .06,
                               }}
                               source={icon}/> :
                    <Text style={[Typography.paperFontHeadline, {color: 'white', width: deviceWidth * .33, marginLeft: deviceWidth * .06}]}>{name}</Text>}
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
    }

    render() {
        Logger.logDebug('ModeSelection', 'render');
        return (
            <Container theme={FlatUITheme}>
                <Header style={FlatUITheme.header}>
                    {EnvironmentConfig.functionsEnabledInSettings ?
                        <Button
                            onPress={() => TypedTransition.from(this)
                                .with({
                                    cb: () => {
                                    }
                                })
                                .to(Settings, Navigator.SceneConfigs.FloatFromLeft)}
                            transparent>
                            <Icon style={{marginTop: 8, color: 'white'}} name="menu"/>
                        </Button> : <View/>}
                    <Title style={[Typography.paperFontTitle, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>GUNAK (गुणक)</Title>
                </Header>
                <Content>
                    <View style={ModeSelection.styles.container}>
                        <Text style={[Typography.paperFontHeadline, {
                            color: 'white',
                            alignSelf: 'center',
                            marginTop: 16
                        }]}>{this.state ? 'Choose a Program' : 'Download Checklists & Facilities'}</Text>
                        <View style={[ModeSelection.styles.modeContainer]}>
                            {this.getMode("NQAS", nqasIcon)}
                            {this.getMode("Kayakalp", kayakalpIcon)}
                            {this.getMode("Laqshya", LaqshyaIcon)}
                            {this.getMode("Dakshata")}
                        </View>
                        <View style={[ModeSelection.styles.modeContainer]}>
                            {this.getMode("ANC Program")}
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20, flexWrap: 'wrap'}}>
                            <Button
                                style={{borderWidth: 1, marginRight: 10, marginBottom: 10}} bordered transparent
                                onPress={() => this.downloadChecklistMetadata()}>{this.downloadButtonContent("Update Checklists/Facilities")}</Button>
                            <Button
                                style={{borderWidth: 1, marginRight: 10, marginBottom: 10}} bordered transparent
                                onPress={() => this.downloadMyAssessments()}>{this.downloadButtonContent("Download My Assessments")}</Button>
                            {this.state.statesAvailableToBeLoaded ? <Button
                                style={{borderWidth: 1, marginBottom: 10}}
                                bordered transparent
                                onPress={() => this.addNewState()}>{this.downloadButtonContent("Add State")}</Button> : null}
                        </View>
                    </View>
                    <Image resizeMode="contain" style={{width: deviceWidth}} source={nhsrcbanner}/>
                </Content>
            </Container>
        );
    }

    downloadButtonContent(normalText) {
        return this.state.downloading ?
            <ActivityIndicator
                animating={true} size="large" color="white" style={{height: 80}}/> :
            <Text style={[Typography.paperFontSubhead, {color: 'white'}]}>{normalText}</Text>;
    }
}

export default ModeSelection;