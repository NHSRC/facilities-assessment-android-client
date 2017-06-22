import React, {Component} from 'react';
import {Dimensions, View, Text, Navigator, StyleSheet, TouchableWithoutFeedback, Image} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, Thumbnail} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path, {PathRoot} from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Dashboard from '../dashboard/Dashboard';
import Settings from "../settings/Settings";
const nqasIcon = require('../img/nqas.png');
const kayakalpIcon = require('../img/kayakalp.png');

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@PathRoot
@Path("/modeSelection")
class ModeSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    static styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            justifyContent: 'center',
        },
        modeContainer: {
            margin: deviceWidth * 0.04,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
        image: {
            height: deviceHeight * 0.33,
            width: deviceWidth * .5,
            marginTop: deviceHeight * .05,
        },
        mode: {
            backgroundColor: 'transparent',
        },
        cardImage: {
            width: 150,
            height: 300,
            marginRight: deviceWidth * .06,
        },
    });


    handleOnPress(mode) {
        return () => TypedTransition.from(this).with({mode: mode}).to(Dashboard);
    }

    render() {
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
                    }]}>Facilities Assessment</Title>
                </Header>
                <Content>
                    <View style={ModeSelection.styles.container}>
                        <Text style={[Typography.paperFontHeadline, {
                            color: 'white',
                            alignSelf: 'center',
                            marginTop: 16
                        }]}>
                            Choose an Assessment Type
                        </Text>
                        <View style={ModeSelection.styles.modeContainer}>
                            <TouchableWithoutFeedback onPress={this.handleOnPress("NQAS")}>
                                <View style={ModeSelection.styles.mode}>
                                    <Image resizeMode="contain"
                                           style={{
                                               width: deviceWidth * .275,
                                               marginLeft: deviceWidth * .06,
                                           }}
                                           source={nqasIcon}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.handleOnPress("Kayakalp")}>
                                <View style={ModeSelection.styles.mode}>
                                    <Image resizeMode="contain"
                                           style={{
                                               width: deviceWidth * .33,
                                               marginRight: deviceWidth * .06,
                                           }}
                                           source={kayakalpIcon}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ModeSelection;