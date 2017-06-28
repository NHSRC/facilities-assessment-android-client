import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import ScoreList from "../reports/ScoreList";

const deviceWidth = Dimensions.get('window').width;

@Path("/drillDownView")
class DrillDownView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
        container: {
            margin: deviceWidth * 0.04,
        }
    });

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header style={Reports.styles.header}>
                    <Button
                        onPress={() => TypedTransition.from(this)
                            .goBack()}
                        transparent>
                        <Icon style={{marginTop: 10, color: 'white'}} name="arrow-back"/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>{this.props.params.title}</Title>
                </Header>
                <Content>
                    <ScoreList scores={this.prop.params.data}/>
                </Content>
            </Container>
        );
    }
}

export default DrillDownView;