import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import TabBar from "./TabBar";
import ScoreList from './ScoreList';
import _ from "lodash";
import bugsnag from "../../utility/Bugsnag";
import PropTypes from 'prop-types';

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
        const selectedTab = this.props.data.tabs.find((tab) => tab.isSelected);
        const scoresToShow = selectedTab.scores;
        const drillable = !_.isEmpty(selectedTab.drillDown);
        const percentageScore = !_.isBoolean(selectedTab.rawScore);
        bugsnag.leaveBreadcrumb(`${selectedTab.title}: ${drillable}`, {type: 'navigation'});
        return (
            <View style={ScoreTabs.styles.container}>
                <TabBar tabs={this.props.data.tabs}/>
                <ScoreList params={this.props.params}
                           facilityAssessment={this.props.facilityAssessment}
                           scores={scoresToShow}
                           percentageScore={percentageScore}
                           drillable={drillable}/>
            </View>
        );
    }
}

ScoreTabs.propTypes = {
    params: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    facilityAssessment: PropTypes.object.isRequired
}

export default ScoreTabs;
