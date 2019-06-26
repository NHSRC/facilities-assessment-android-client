import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './start/StartView';
import FlatUITheme from '../themes/flatUI';
import OpenView from './open/OpenView';
import ReportsView from './reports/ReportsView';
import {Container, Header, Title, Content, Icon, Button, Tabs, Tab} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import bugsnag from "../../utility/Bugsnag";

const deviceWidth = Dimensions.get('window').width;

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
            margin: deviceWidth * 0.04,
        }
    });

    componentDidMount() {
        bugsnag.leaveBreadcrumb("dashboard", {type: 'navigation'});
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Content keyboardShouldPersistTaps={'always'}>
                    <Header style={FlatUITheme.header}>
                        <Button transparent onPress={() => {
                            this.dispatchAction(Actions.RESET_FORM, {
                                cb: () => {}
                            });
                            TypedTransition.from(this).goBack();
                        }}>
                            <Icon style={{marginTop: 10, color: "white"}} name='arrow-back'/>
                        </Button>
                        <Title style={[Typography.paperFontHeadline, {
                            fontWeight: 'bold',
                            color: "white"
                        }]}>{this.props.params.mode}</Title>
                    </Header>
                    <Tabs style={StartView.styles.tabs}>
                        <Tab heading="START">
                            <StartView {...this.props.params}/>
                        </Tab>
                        <Tab heading="ONGOING">
                            <OpenView {...this.props.params}/>
                        </Tab>
                        <Tab heading="REPORTS">
                            <ReportsView {...this.props.params}/>
                        </Tab>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

export default Dashboard;