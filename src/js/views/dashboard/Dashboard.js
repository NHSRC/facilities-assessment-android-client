import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, Navigator} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './start/StartView';
import FlatUITheme from '../themes/flatUI';
import OpenView from './open/OpenView';
import ReportsView from './reports/ReportsView';
import {Container, Header, Title, Content, Icon, Button, Tabs} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import CustomTabBar from '../common/CustomTabBar';
import TypedTransition from "../../framework/routing/TypedTransition";

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
            backgroundColor: '#212121',
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
                <Content keyboardShouldPersistTaps={'always'}>
                    <Header style={Dashboard.styles.header}>
                        <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                            <Icon style={{marginTop: 10, color: "white"}} name='arrow-back'/>
                        </Button>
                        <Title style={[Typography.paperFontHeadline, {
                            fontWeight: 'bold',
                            color: "white"
                        }]}>{this.props.params.mode}</Title>
                    </Header>
                    <Tabs style={StartView.styles.tabs} renderTabBar={() => <CustomTabBar/>}>
                        <StartView tabLabel="START" {...this.props.params}/>
                        <OpenView tabLabel="ONGOING" {...this.props.params}/>
                        <ReportsView tabLabel="REPORTS" {...this.props.params}/>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;