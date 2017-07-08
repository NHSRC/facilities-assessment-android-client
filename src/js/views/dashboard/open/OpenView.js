import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from '../../../action';
import Dashboard from '../Dashboard';
import AssessmentList from '../common/AssessmentList';
import _ from 'lodash';
import TypedTransition from "../../../framework/routing/TypedTransition";
import ChecklistSelection from "../../checklistSelection/ChecklistSelection";
import Logger from "../../../framework/Logger";


class OpenView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().openAssessments;
        this.unsubscribe = store.subscribeTo('openAssessments', this.handleChange.bind(this));
    }


    handleChange() {
        const newState = this.context.getStore().getState().openAssessments;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_ASSESSMENTS, {...this.props});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleContinue(assessment) {
        return () => {
            TypedTransition.from(this).with({
                assessmentTool: assessment.assessmentTool,
                facility: assessment.facility,
                assessmentType: assessment.assessmentType,
                facilityAssessment: assessment,
                ...this.props
            }).to(ChecklistSelection);
        }
    }

    handleSubmit(assessment) {
        return () => this.dispatchAction(Actions.SYNC_ASSESSMENT, {
            "assessment": assessment,
            cb: () => this.dispatchAction(Actions.ASSESSMENT_SYNCED, {assessment: assessment, ...this.props})
        });

    }

    allowSubmit() {
        return this.state.serverConnected;
    }

    render() {
        let completedAssessments = this.state.completedAssessments.map((assessment) => this.state.syncing.indexOf(assessment.uuid) >= 0 ?
            {syncing: true, ...assessment} : assessment);
        const AssessmentLists = [
            {
                header: "SUBMIT ASSESSMENTS",
                assessments: completedAssessments,
                buttons: [
                    {
                        text: "SUBMIT",
                        shouldRender: this.allowSubmit.bind(this),
                        onPress: this.handleSubmit.bind(this)
                    },
                    {
                        text: "EDIT",
                        onPress: this.handleContinue.bind(this)
                    }
                ]
            },
            {
                header: "OPEN ASSESSMENTS",
                assessments: this.state.openAssessments,
                buttons: [
                    {
                        text: "CONTINUE",
                        onPress: this.handleContinue.bind(this)
                    },
                ]
            },
            {
                header: "SUBMITTED ASSESSMENTS",
                assessments: this.state.submittedAssessments,
                buttons: [
                    {
                        text: "EDIT",
                        onPress: this.handleContinue.bind(this)
                    },
                ]
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

export default OpenView;