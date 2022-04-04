import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {List, ListItem} from 'native-base';
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import _ from 'lodash';
import Reports from "./Reports";
import {Navigator} from 'react-native-deprecated-custom-components';
import ReportScoreItem from "../../models/ReportScoreItem";

const deviceHeight = Dimensions.get('window').height;

class ScoreList extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        container: {
            marginTop: deviceHeight * .01
        },
        scoreItem: {
            marginLeft: 0,
            paddingRight: 24,
            paddingLeft: 24,
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: "white",
        },
        scoreItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
        }
    });

    handlePress(selectionUUID, selectionName, score) {
        this.dispatchAction(Actions.DRILL_DOWN, {
            facilityAssessment: this.props.facilityAssessment,
            selectionName: selectionName,
            selectionUUID: selectionUUID,
            overallScore: score
        });
        TypedTransition
            .from(this)
            .with({...this.props.params, drilledDown: true})
            .to(Reports, Navigator.SceneConfigs.FadeAndroid);
    }

    render() {
        const getScore = (score) => this.props.percentageScore ? `${ReportScoreItem.displayScore(score)}%` : `${ReportScoreItem.displayScore(score)}`;
        const onPressHandler = this.props.drillable ? this.handlePress.bind(this) : _.noop;
        let Items = this.props.scores.map((scoreEntry, idx) => (
            <ListItem key={idx} onPress={() => onPressHandler(scoreEntry.uuid, scoreEntry.name, scoreEntry.score)} style={ScoreList.styles.scoreItem}>
                <View style={ScoreList.styles.scoreItemContainer}>
                    <Text style={[Typography.paperFontSubhead, {color: "black", flex: .75}]}>{scoreEntry.name}</Text>
                    <Text style={{flex: .05}}/>
                    <View style={{
                        backgroundColor: PrimaryColors.yellow,
                        flex: .20,
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <Text style={[Typography.paperFontSubhead, {
                            color: 'white',
                            fontWeight: '500',
                            paddingTop: 5,
                            paddingBottom: 5
                        }]}>
                            {getScore(scoreEntry.score)}
                        </Text>
                    </View>
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
