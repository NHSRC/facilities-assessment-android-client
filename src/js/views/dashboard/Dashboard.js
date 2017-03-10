import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './start/StartView';
import FlatUITheme from '../themes/flatUI';
import OpenView from './open/OpenView';
import ReportsView from './reports/ReportsView';
import {Container, Header, Title, Content, Icon, Button, Tabs} from 'native-base';
import Path, {PathRoot} from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import CustomTabBar from '../common/CustomTabBar';
import PrimaryColors from '../styles/PrimaryColors';

const deviceWidth = Dimensions.get('window').width;

@Path("/dashboard")
class Dashboard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#303030',
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

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Content>
                    <Header style={Dashboard.styles.header}>
                        <Button transparent>
                            <Icon style={{marginTop: 10, color: "white"}} name="menu"/>
                        </Button>
                        <Title style={[Typography.paperFontHeadline, {
                            fontWeight: 'bold',
                            color: "white"
                        }]}>{this.props.params.mode}</Title>
                    </Header>
                    <Tabs style={StartView.styles.tabs} renderTabBar={() => <CustomTabBar/>}>
                        <StartView tabLabel="START" {...this.props.params}/>
                        <OpenView tabLabel="OPEN" {...this.props.params}/>
                        <ReportsView tabLabel="REPORTS" {...this.props.params}/>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;