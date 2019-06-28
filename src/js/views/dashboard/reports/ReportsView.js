import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import _ from 'lodash';
import AbstractComponent from "../../common/AbstractComponent";
import Dashboard from '../Dashboard';
import AssessmentList from '../common/AssessmentList';
import Reports from '../../reports/Reports';
import Certification from '../../cert/Certification';
import TypedTransition from "../../../framework/routing/TypedTransition";
import Logger from "../../../framework/Logger";

const deviceWidth = Dimensions.get('window').width;

class ReportsView extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'openAssessments');
    }

    static styles = StyleSheet.create({});

    showReports(assessment) {
        return () => TypedTransition.from(this).with({
            assessmentTool: assessment.assessmentTool,
            facility: assessment.facility,
            assessmentType: assessment.assessmentType,
            facilityAssessment: assessment,
            ...this.props
        }).to(Reports);
    }

    certificationCriteria(assessment) {
        return () => TypedTransition.from(this).with({
            assessmentTool: assessment.assessmentTool,
            facility: assessment.facility,
            assessmentType: assessment.assessmentType,
            facilityAssessment: assessment,
            ...this.props
        }).to(Certification);
    }

    render() {
        Logger.logDebug('ReportsView', 'render');
        const AssessmentLists = [
            {
                header: "CERTIFIABLE ASSESSMENTS",
                assessments: this.state.certifiableAssessments,
                buttons: [
                    {
                        text: "CERT",
                        onPress: this.certificationCriteria.bind(this),
                    }
                ]
            },
            {
                header: "COMPLETED ASSESSMENTS",
                assessments: this.state.completedAssessments,
                buttons: [
                    {
                        text: "VIEW",
                        onPress: this.showReports.bind(this)
                    }
                ]
            },
            {
                header: "SUBMITTED ASSESSMENTS",
                assessments: this.state.submittedAssessments,
                buttons: [
                    {
                        text: "VIEW",
                        onPress: this.showReports.bind(this)
                    },
                ]
            },
        ].filter(({assessments}) => !_.isEmpty(assessments))
            .map((assessmentList, key) =>
                <AssessmentList mode={this.props.mode} key={key} {...assessmentList}/>);
        return (
            <View style={Dashboard.styles.tab}>
                {AssessmentLists}
            </View>
        );
    }
}

export default ReportsView;