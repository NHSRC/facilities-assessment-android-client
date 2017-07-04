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
import _ from 'lodash';
import ScoreList from "../reports/ScoreList";
import {takeSnapshot} from "react-native-view-shot";
import Share from "react-native-share";

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

    share(shareOpts) {
        Share.open(shareOpts);
    }

    snapshot() {
        takeSnapshot(this.refs["drilldown"], {
            format: "jpeg",
            result: "data-uri"
        }).then(uri => this.share({url: uri}));
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header style={DrillDownView.styles.header}>
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
                    <Button
                        onPress={this.snapshot.bind(this)}
                        transparent>
                        <Icon style={{fontSize: 22, marginTop: 10, color: 'white'}} name="share"/>
                    </Button>
                </Header>
                <Content ref="drilldown">
                    <ScoreList scores={this.props.params.data} handlePress={_.noop}/>
                </Content>
            </Container>
        );
    }
}

export default DrillDownView;