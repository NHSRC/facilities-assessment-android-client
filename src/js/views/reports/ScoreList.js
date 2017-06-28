import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {List, ListItem} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import TabBar from "./TabBar";
import _ from 'lodash';
import DrillDownView from '../drillDown/DrillDownView';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ScoreList extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {
            marginRight: deviceWidth * .02,
            marginTop: deviceHeight * .01
        },
        scoreItem: {
            paddingRight: 24,
            paddingLeft: 24,
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: "white",
        },
        scoreItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    });

    handlePress(selectionName) {
        return () => this.dispatchAction(Actions.DRILL_DOWN, {
            facilityAssessment: this.props.facilityAssessment,
            selectionName: selectionName,
            cb: (title, data) => TypedTransition.from(this).with({title: title, data: data}).to(DrillDownView)
        })
    }

    render() {
        let Items = _.toPairs(this.props.scores).map(([item, score], idx) => (
            <ListItem key={idx} onPress={(item) => this.handlePress(item)} style={ScoreList.styles.scoreItem}>
                <View style={ScoreList.styles.scoreItemContainer}>
                    <Text style={[Typography.paperFontBody1, {color: "black"}]}>{item}</Text>
                    <Text style={[Typography.paperFontBody1, {color: "black"}]}>{`${parseInt(score)}%`}</Text>
                </View>
            </ListItem>
        ));
        return (
            <View style={ScoreList.styles.container}>
                <List>
                    {Items}
                </List>
            </View>
        );
    }
}

export default ScoreList;