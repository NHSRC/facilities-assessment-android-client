import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Dashboard from '../Dashboard';
import Actions from '../../../action';
import AssessmentList from '../common/AssessmentList';
import Reports from '../../reports/Reports';
import TypedTransition from "../../../framework/routing/TypedTransition";

class ReportsView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().openAssessments;
        this.unsubscribe = store.subscribeTo('openAssessments', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().dashboard;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_ASSESSMENTS);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    showReports(assessment) {
        return () => TypedTransition.from(this).with({
            assessmentTool: assessment.assessmentTool,
            facility: assessment.facility,
            assessmentType: assessment.assessmentType,
            facilityAssessment: assessment
        }).to(Reports)
    }

    render() {
        const AssessmentLists = [
            {
                header: "COMPLETED ASSESSMENTS",
                assessments: this.state.completedAssessments,
                buttonText: "VIEW DETAILS",
                handlePress: this.showReports.bind(this),
            },
            {
                header: "SUBMITTED ASSESSMENTS",
                assessments: this.state.submittedAssessments,
                buttonText: "VIEW DETAILS",
                handlePress: this.showReports.bind(this),
            }
        ].filter(({assessments}) => !_.isEmpty(assessments))
            .map((assessmentList, key) =>
                <AssessmentList key={key} {...assessmentList}/>);
        return (
            <View style={Dashboard.styles.tab}>
                {AssessmentLists}
            </View>
        );
    }
}

export default ReportsView;