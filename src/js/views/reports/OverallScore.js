import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import {formatDateOnlyHuman} from '../../utility/DateUtils';
import {AnimatedGaugeProgress, GaugeProgress} from 'react-native-simple-gauge';
import _ from 'lodash';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class OverallScore extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {
            padding: 10,
            backgroundColor: PrimaryColors.blue,
        },
        innerContainer: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        scorePercentage: {
            color: "#ffa000"
        },
        scoreText: {
            color: "#ffa000"
        }
    });

    render() {
        return (
            <View style={OverallScore.styles.container}>
                <View style={{marginBottom: 10}}>
                    <Text
                        style={[Typography.paperFontTitle, {color: "white", alignSelf: 'center'}]}>
                        {`${this.props.facility.name}'s ${this.props.assessmentType.name} assessment on ${formatDateOnlyHuman(this.props.facilityAssessment.startDate)}`}
                    </Text>
                </View>
                <View style={OverallScore.styles.innerContainer}>
                    <AnimatedGaugeProgress
                        size={deviceHeight * .23}
                        width={6}
                        fill={this.props.score}
                        rotation={90}
                        cropDegree={120}
                        tintColor="#ffc107"
                        backgroundColor={PrimaryColors.medium_white}
                        strokeCap="circle">
                        {() =>
                            <View style={{
                                marginTop: -(deviceHeight * .168),
                                alignSelf: 'center',
                                flexDirection: 'column'
                            }}>
                                <Text style={[Typography.paperFontDisplay2, OverallScore.styles.scorePercentage]}>
                                    {`${parseInt(this.props.score)}%`}
                                </Text>
                                <Text style={[Typography.paperFontBody1, OverallScore.styles.scoreText]}>
                                    {`${_.startCase(this.props.scoreText.toLowerCase())} Score`}
                                </Text>
                            </View>}
                    </AnimatedGaugeProgress>
                    <View>
                        <Text style={{color: "white"}}>
                            {`Checklists Assessed: ${this.props.checklistStats.assessed}/${this.props.checklistStats.total}`}
                        </Text>
                        <Text style={{color: "white"}}>
                            {`Non Compliant: ${this.props.checkpointStats.nonCompliantCheckpoints}`}
                        </Text>
                        <Text style={{color: "white"}}>
                            {`Partially Compliant: ${this.props.checkpointStats.partiallyCompliantCheckpoints}`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default OverallScore;