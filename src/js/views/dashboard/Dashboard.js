import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './StartView';
import FlatUITheme from '../themes/flatUI';
import OpenView from './OpenView';
import ReportsView from './ReportsView';
import {Container, Header, Title, Content, Icon, Button, Tabs} from 'native-base';
import Path, {PathRoot} from "../../framework/routing/Path";
import Typography from '../styles/Typography';

@PathRoot
@Path("/dashboard")
class Dashboard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().dashboard;
        this.setState(newState);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(checklist) {
    }


    render() {
        return (
            <Container theme={FlatUITheme}>
                <Content>
                    <Header>
                        <Button transparent>
                            <Icon name={"menu"}/>
                        </Button>
                        <Title style={Typography.paperFontHeadline}>NHSRC</Title>
                    </Header>
                    <Tabs>
                        <StartView tabLabel="Start"/>
                        <OpenView tabLabel="Open"/>
                        <ReportsView tabLabel="Reports"/>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;