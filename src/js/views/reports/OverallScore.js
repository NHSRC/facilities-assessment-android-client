import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import {formatDateOnlyHuman} from '../../utility/DateUtils';
import _ from 'lodash';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

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
            height: deviceHeight * .29,
        },
        innerContainer: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        scoreTextAndPercentage: {
            color: "#ffa000",
            alignSelf: 'center'
        }
    });

    render() {
        return (
            <View style={OverallScore.styles.container}>
                <View style={{marginBottom: 10}}>
                    <Text
                        style={[Typography.paperFontSubhead, {color: "white", alignSelf: 'center'}]}>
                        {`${this.props.facility.name}'s ${this.props.assessmentType.name} assessment on ${formatDateOnlyHuman(this.props.facilityAssessment.startDate)}`}
                    </Text>
                </View>
                <View style={OverallScore.styles.innerContainer}>
                    <AnimatedCircularProgress
                        size={deviceHeight * .18}
                        width={6}
                        fill={this.props.score}
                        rotation={-90}
                        arcSweepAngle={360}
                        tintColor="#ffc107"
                        backgroundColor={PrimaryColors.medium_white}
                        strokeCap="circle">
                        {() =>
                            <View style={{
                                marginTop: 0,
                                alignSelf: 'center',
                                flexDirection: 'column'
                            }}>
                                <Text style={[Typography.paperFontDisplay2, OverallScore.styles.scoreTextAndPercentage]}>
                                    {`${parseInt(this.props.score)}%`}
                                </Text>
                                <Text style={[Typography.paperFontMenu, OverallScore.styles.scoreTextAndPercentage]}>
                                    {`${_.startCase(this.props.scoreText.toLowerCase())}`}
                                </Text>
                            </View>}
                    </AnimatedCircularProgress>
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