import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, Image, TextInput} from 'react-native';
import {Container, Content, Title, Button, Header, Icon, Thumbnail, Card, CardItem} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path, {PathRoot} from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Dashboard from '../dashboard/Dashboard';
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
            margin: deviceWidth * 0.04,
            flex: 1,
            flexDirection: 'column',
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
        card: {
            width: deviceWidth * .836,
            marginTop: deviceHeight * .025,
        },
        cardImage: {
            marginRight: deviceWidth * .06,
        },
    });


    handleOnPress(mode) {
        return () => TypedTransition.from(this).with({mode: mode}).to(Dashboard);
    }

    renderMode(mode, modeText, icon) {
        return (
            <Card style={ModeSelection.styles.card}>
                <CardItem onPress={this.handleOnPress(mode)}>
                    <Thumbnail size={deviceWidth * .233}
                               resizeMode="contain"
                               style={ModeSelection.styles.cardImage}
                               source={icon}/>
                    <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                        {modeText}
                    </Text>
                </CardItem>
            </Card>
        )
    }

    render() {

        return (
            <Container theme={FlatUITheme}>
                <Header style={ModeSelection.styles.header}>
                    <Button transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="menu"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>Facilities Assessment</Title>
                </Header>
                <Content>
                    <View style={ModeSelection.styles.container}>
                        <Text style={[Typography.paperFontHeadline, {color: 'white'}]}>
                            Choose an Assessment Type
                        </Text>
                        {this.renderMode("NQAS", "NQAS", nqasIcon)}
                        {this.renderMode("Kayakalp", "Kayakalp", kayakalpIcon)}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ModeSelection;