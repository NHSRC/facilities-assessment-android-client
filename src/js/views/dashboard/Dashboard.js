import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './StartView';
import FlatUITheme from '../themes/flatUI';
import OpenView from './OpenView';
import ReportsView from './ReportsView';
import {Container, Header, Title, Content, Icon, Button, Tabs} from 'native-base';
import Path, {PathRoot} from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import CustomTabBar from '../common/CustomTabBar';

const deviceWidth = Dimensions.get('window').width;

@PathRoot
@Path("/dashboard")
class Dashboard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        tabs: {
            flex: 3,
            margin: 0
        },
        tab: {
            flex: 1,
            margin: deviceWidth*0.04
        }
    });

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
                        <Title style={[Typography.paperFontHeadline, {fontWeight: 'bold'}]}>NHSRC</Title>
                    </Header>
                    <Tabs style={StartView.styles.tabs} renderTabBar={() => <CustomTabBar/>}>
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