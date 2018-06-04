import React from "react";
import {Dimensions, Image, Navigator, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
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
        super(props, context);
        this.handleOnPress = this.handleOnPress.bind(this);
        this.unsubscribe = context.getStore().subscribeTo('modeSelection', this.handleChange.bind(this));
    }

    handleChange() {
        const newState = this.context.getStore().getState().modeSelection;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.MODE_SELECTION, {...this.props.params})
    }

    componentWillUnmount() {
        this.unsubscribe();
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
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
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
                    <Text style={[Typography.paperFontHeadline, {color: 'white', width: deviceWidth * .33, marginLeft: deviceWidth * .06, marginTop: 60}]}>{name}</Text>}
            </TouchableWithoutFeedback>
        ) : null;
    }

    addNewState() {
        TypedTransition.from(this).with({chooseAdditional: true}).to(StateSelection);
    }

    render() {
        Logger.logDebug('ModeSelection', 'render');
        return (
            <Container theme={FlatUITheme}>
                <Header style={ModeSelection.styles.header}>
                    {EnvironmentConfig.functionsEnabledInSettings ?
                        <Button
                            onPress={() => TypedTransition.from(this)
                                .with({
                                    cb: () => {
                                    }
                                })
                                .to(Settings, Navigator.SceneConfigs.FloatFromLeft)}
                            transparent>
                            <Icon style={{marginTop: 10, color: 'white'}} name="menu"/>
                        </Button> : <View/>}
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>GUNAK गुणक</Title>
                    {EnvironmentConfig.shouldUsePackagedSeedData ? <Button
                        style={{flex: 0.05}}
                        iconLeft={true}
                        onPress={() => this.addNewState()}>
                        <Icon style={{color: "white"}} name="edit-location"/>
                    </Button> : null}
                </Header>
                <Content>
                    <View style={ModeSelection.styles.container}>
                        {/*<Text style={[Typography.paperFontHeadline, {*/}
                        {/*color: PrimaryColors.yellow,*/}
                        {/*alignSelf: 'center',*/}
                        {/*marginTop: 16,*/}
                        {/*}]}>*/}
                        {/*<Text style={ModeSelection.styles.highlight}>Gu</Text>*/}
                        {/*ide for <Text style={ModeSelection.styles.highlight}>N</Text>QAS & <Text*/}
                        {/*style={ModeSelection.styles.highlight}>K</Text>ayakalp*/}
                        {/*</Text>*/}
                        <Text style={[Typography.paperFontHeadline, {
                            color: 'white',
                            alignSelf: 'center',
                            marginTop: 16
                        }]}>{this.state ? 'Choose an Assessment Type' : 'Download Checklists & Facilities'}</Text>
                        <View style={[ModeSelection.styles.modeContainer]}>
                            {this.getMode("NQAS", nqasIcon)}
                            {this.getMode("Kayakalp", kayakalpIcon)}
                            {this.getMode("Laqshya", LaqshyaIcon)}
                            {this.getMode("Dakshata")}
                        </View>
                        <View style={[ModeSelection.styles.modeContainer]}>
                            {this.getMode("Maternity Services")}
                        </View>
                    </View>
                </Content>
                <Footer style={{backgroundColor: 'transparent'}}>
                    <Image resizeMode="contain"
                           style={{
                               width: deviceWidth,
                           }}
                           source={nhsrcbanner}/>
                </Footer>
            </Container>
        );
    }
}

export default ModeSelection;