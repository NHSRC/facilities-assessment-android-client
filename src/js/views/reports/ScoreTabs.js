import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import TabBar from "./TabBar";
import ScoreList from './ScoreList';
import  _ from "lodash";


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
        return (
            <View style={ScoreTabs.styles.container}>
                <TabBar mode={this.props.mode} tabs={this.props.data.tabs}/>
                <ScoreList params={this.props.params}
                           facilityAssessment={this.props.facilityAssessment}
                           scores={scoresToShow}
                           drillable={drillable}/>
            </View>
        );
    }
}

export default ScoreTabs;