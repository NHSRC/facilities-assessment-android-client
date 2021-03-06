import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import StartView from './start/StartView';
import OngoingAssessmentsView from './open/OngoingAssessmentsView';
import ReportsView from './reports/ReportsView';
import {Tab, Tabs} from 'native-base';
import Path from "../../framework/routing/Path";
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from "../../action";
import bugsnag from "../../utility/Bugsnag";
import GunakContainer from "../common/GunakContainer";
import PrimaryColors from "../styles/PrimaryColors";
import ModeSelection from "../modes/ModeSelection";

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
                TypedTransition.from(this).resetTo(ModeSelection);
            }}>
                <Tabs style={Dashboard.styles.tabs}>
                    <Tab heading="START">
                        <StartView {...this.props.params}/>
                    </Tab>
                    <Tab heading="ONGOING">
                        <OngoingAssessmentsView {...this.props.params}/>
                    </Tab>
                    <Tab heading="REPORTS">
                        <ReportsView {...this.props.params}/>
                    </Tab>
                </Tabs>
            </GunakContainer>
        );
    }
}

export default Dashboard;
