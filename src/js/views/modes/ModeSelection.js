import React, {Component} from 'react';
import {Dimensions, View, Text, Navigator, StyleSheet, TouchableWithoutFeedback, Image} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, Thumbnail, Footer} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path, {PathRoot} from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Dashboard from '../dashboard/Dashboard';
import Settings from "../settings/Settings";
import Config from 'react-native-config';
import Logger from "../../framework/Logger";

const nqasIcon = require('../img/nqas.png');
const kayakalpIcon = require('../img/kayakalp.png');
const nhsrcbanner = require('../img/nhsrcbanner.png');

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import Actions from '../../action';

@PathRoot
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
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
        modeContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
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

    render() {
        let showDakshata = _.isNil(this.state) || this.state.modes.indexOf("DAKSHATA") > -1;
        const Dakshata = showDakshata ? (
            <TouchableWithoutFeedback onPress={this.handleOnPress("Dakshata")}>
                <View>
                    <Text style={[Typography.paperFontDisplay2, {color: 'white',}]}>Dakshata</Text>
                </View>
            </TouchableWithoutFeedback>
        ) : null;
        const additionalStyles = showDakshata ? {alignItems: 'center', justifyContent: 'center'} : {};
        return (
            <Container theme={FlatUITheme}>
                <Header style={ModeSelection.styles.header}>
                    <Button
                        onPress={() => TypedTransition.from(this)
                            .with({
                                cb: () => {
                                }
                            })
                            .to(Settings, Navigator.SceneConfigs.FloatFromLeft)}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="menu"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>GUNAK गुणक</Title>
                </Header>
                <Content>
                    <View style={[ModeSelection.styles.container,]}>
                        <Text style={[Typography.paperFontHeadline, {
                            color: PrimaryColors.yellow,
                            alignSelf: 'center',
                            marginTop: 16,
                        }]}>
                            <Text style={ModeSelection.styles.highlight}>Gu</Text>
                            ide for <Text style={ModeSelection.styles.highlight}>N</Text>QAS & <Text
                            style={ModeSelection.styles.highlight}>K</Text>ayakalp
                        </Text>
                        <Text style={[Typography.paperFontHeadline, {
                            color: 'white',
                            alignSelf: 'center',
                            marginTop: 16
                        }]}>
                            Choose an Assessment Type
                        </Text>
                        <View style={[ModeSelection.styles.modeContainer, additionalStyles]}>
                            <TouchableWithoutFeedback onPress={this.handleOnPress("NQAS")}>
                                <View style={ModeSelection.styles.mode}>
                                    <Image resizeMode="contain"
                                           style={{
                                               maxHeight: 300,
                                               width: deviceWidth * .33,
                                               marginLeft: deviceWidth * .06,
                                           }}
                                           source={nqasIcon}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.handleOnPress("Kayakalp")}>
                                <View style={ModeSelection.styles.mode}>
                                    <Image resizeMode="contain"
                                           style={{
                                               maxHeight: 300,
                                               width: deviceWidth * .33,
                                               marginRight: deviceWidth * .06,
                                           }}
                                           source={kayakalpIcon}/>
                                </View>
                            </TouchableWithoutFeedback>
                            {Dakshata}
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