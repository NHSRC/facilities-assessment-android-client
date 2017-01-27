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
import PrimaryColors from '../styles/PrimaryColors';

const deviceWidth = Dimensions.get('window').width;

@PathRoot
@Path("/dashboard")
class Dashboard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
        },
        tabs: {
            flex: 3,
            margin: 0
        },
        tab: {
            flex: 1,
            margin: deviceWidth * 0.04,
        }
    });

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Content>
                    <Header style={Dashboard.styles.header}>
                        <Button transparent>
                            <Icon style={{marginTop: 10}} name={"menu"}/>
                        </Button>
                        <Title style={[Typography.paperFontHeadline, {
                            fontWeight: 'bold',
                            color: PrimaryColors.subheader_black
                        }]}>NHSRC</Title>
                    </Header>
                    <Tabs style={StartView.styles.tabs} renderTabBar={() => <CustomTabBar/>}>
                        <StartView tabLabel="START"/>
                        <OpenView tabLabel="OPEN"/>
                        <ReportsView tabLabel="REPORTS"/>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;