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
import OverallScore from "./OverallScore";
import ScoreTabs from "./ScoreTabs";

const deviceWidth = Dimensions.get('window').width;

@Path("/reports")
class Reports extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().reports;
        this.unsubscribe = this.unsubscribe = store.subscribeTo('reports', this.handleChange.bind(this));
    }

    handleChange() {
        const newState = this.context.getStore().getState().reports;
        this.setState(newState);
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

    componentWillMount() {
        this.dispatchAction(Actions.GET_ALL_SCORES, {...this.props.params})
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
                    }]}>Reports</Title>
                </Header>
                <Content>
                    <OverallScore score={this.state.overallScore} checkpointStats={this.state.checkpointStats}/>
                    <ScoreTabs data={this.state}/>
                </Content>
            </Container>
        );
    }
}

export default Reports;