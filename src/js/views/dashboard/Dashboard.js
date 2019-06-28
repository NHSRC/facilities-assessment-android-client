import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './start/StartView';
import OpenView from './open/OpenView';
import ReportsView from './reports/ReportsView';
import {Tab, Tabs} from 'native-base';
import Path from "../../framework/routing/Path";
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import bugsnag from "../../utility/Bugsnag";
import GunakContainer from "../common/GunakContainer";
import PrimaryColors from "../styles/PrimaryColors";

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
            margin: deviceWidth * 0.01
        }
    });

    componentDidMount() {
        bugsnag.leaveBreadcrumb("dashboard", {type: 'navigation'});
    }

    render() {
        return (
            <GunakContainer title={this.props.params.mode} onHeaderButtonPress={() => {
                this.dispatchAction(Actions.RESET_FORM, {
                    cb: () => {
                    }
                });
                TypedTransition.from(this).goBack();
            }}>
                <Tabs
                    style={Dashboard.styles.tabs}>
                    <Tab heading="START" style={{backgroundColor: PrimaryColors.caption_black}}>
                        <StartView {...this.props.params}/>
                    </Tab>
                    <Tab heading="ONGOING" style={{backgroundColor: PrimaryColors.caption_black}}>
                        <OpenView {...this.props.params}/>
                    </Tab>
                    <Tab heading="REPORTS" style={{backgroundColor: PrimaryColors.caption_black}}>
                        <ReportsView {...this.props.params}/>
                    </Tab>
                </Tabs>
            </GunakContainer>
        );
    }
}

export default Dashboard;