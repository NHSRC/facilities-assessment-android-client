import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Modal, View, StyleSheet} from 'react-native';
import Typography from "../styles/Typography";
import {Button, Text} from "native-base";
import PropTypes from 'prop-types';
import GunakContainer from "../common/GunakContainer";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from '../../action';
import _ from 'lodash';

class AssessmentSummary extends AbstractComponent {
    static propTypes = {
        summary: PropTypes.any.isRequired
    };

    static styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            marginHorizontal: 10,
            padding: 10,
            flexDirection: 'column'
        }
    });

    constructor(props, context) {
        super(props, context);
    }

    close() {
        this.dispatchAction(Actions.ASSESSMENT_SUMMARY_CLOSED);
    }

    renderItem(label, value, key = label, separator = ":") {
        return <View style={{flexDirection: 'row'}} key={key}>
            <Text style={[Typography.paperFontBody1, {marginTop: 2}]}>{`${label}${separator} `}</Text>
            <Text style={[Typography.paperFontBody2]}>{value}</Text>
        </View>
    }

    render() {
        return <Modal transparent={true} visible={true} onRequestClose={() => {
        }}>
            <GunakContainer title="Assessment Summary" hideBack={true}>
                <View style={AssessmentSummary.styles.container}>
                    {this.renderItem("Facility", this.props.summary.facilityName)}
                    {this.renderItem("Assessment tool", this.props.summary.assessmentToolName)}
                    {this.renderItem("Assessment type", this.props.summary.assessmentTypeName)}
                    {this.renderItem("Assessment number", this.props.summary.assessmentNumber)}
                    {this.renderItem("Assessment start date", this.props.summary.assessmentStartDate)}
                    {this.renderItem("Assessment end date", this.props.summary.assessmentEndDate)}

                    <Text style={[Typography.paperFontTitle, {marginTop: 15}]}>Departments assessed</Text>
                    <Text style={[Typography.paperFontCaption]}>{_.join(this.props.summary.departmentsAssessed, ", ")}</Text>

                    <Text style={[Typography.paperFontTitle, {marginTop: 15}]}>Assessors list</Text>
                    {this.props.summary.customInfos.map((customInfo, index) => this.renderItem(customInfo.assessmentMetaDataName, customInfo.valueString, `${index}.${customInfo.assessmentMetaDataName}`))}
                    {this.props.summary.assessors.map((assessor, index) => this.renderItem(assessor.name, assessor.email, assessor.email, ","))}
                    <Button block
                            style={{backgroundColor: PrimaryColors.blue, marginHorizontal: 10, marginTop: 20, flex: 0.5}}
                            onPress={() => this.close()}><Text>CLOSE</Text></Button>
                </View>
            </GunakContainer>
        </Modal>;
    }
}

export default AssessmentSummary;
