import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import TabBar from "./TabBar";
import ScoreList from './ScoreList';
import _ from "lodash";
import bugsnag from "../../utility/Bugsnag";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ScoreTabs extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {},
        scorePercentage: {
            color: "#ffa000"
        },
        scoreText: {
            color: "#ffa000"
        }
    });

    render() {
        let selectedTab = this.props.data.tabs.find((tab) => tab.isSelected);
        const scoresToShow = selectedTab.scores;
        const drillable = !_.isEmpty(selectedTab.drillDown);
        const percentageScore = !_.isBoolean(selectedTab.rawScore);
        bugsnag.leaveBreadcrumb(`${selectedTab.title}: ${drillable}`, {type: 'navigation'});
        return (
            <View style={ScoreTabs.styles.container}>
                <TabBar mode={this.props.mode} tabs={this.props.data.tabs}/>
                <ScoreList params={this.props.params}
                           facilityAssessment={this.props.facilityAssessment}
                           scores={scoresToShow}
                           percentageScore={percentageScore}
                           drillable={drillable}/>
            </View>
        );
    }
}

export default ScoreTabs;
