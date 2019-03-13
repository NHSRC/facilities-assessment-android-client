import React, {Component} from 'react';
import {Alert, Modal, View} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from '../../../action';
import Dashboard from '../Dashboard';
import AssessmentList from '../common/AssessmentList';
import _ from 'lodash';
import TypedTransition from "../../../framework/routing/TypedTransition";
import ChecklistSelection from "../../checklistSelection/ChecklistSelection";
import Logger from "../../../framework/Logger";
import AssessmentIndicators from "../../indicator/AssessmentIndicators";
import SubmitAssessment from "./SubmitAssessment";
import FacilityAssessment from "../../../models/FacilityAssessment";
import AssessmentTool from "../../../models/AssessmentTool";


class OpenView extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'openAssessments');
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_ASSESSMENTS, {...this.props});
    }

    handleContinue(facilityAssessment) {
        return () => {
            TypedTransition.from(this).with({
                assessmentTool: facilityAssessment.assessmentTool,
                facility: facilityAssessment.facility,
                assessmentType: facilityAssessment.assessmentType,
                facilityAssessment: facilityAssessment,
                state: facilityAssessment.state,
                ...this.props
            }).to(facilityAssessment.assessmentTool.assessmentToolType === AssessmentTool.INDICATOR ? AssessmentIndicators : ChecklistSelection);
        }
    }

    handleSubmit() {
        this.dispatchAction(Actions.SYNC_ASSESSMENT, {
            facilityAssessment: this.state.submittingAssessment,
            cb: () => this.dispatchAction(Actions.ASSESSMENT_SYNCED, {facilityAssessment: this.state.submittingAssessment, ...this.props}),
            errorHandler: (error) => {
                Logger.logError('OpenView', error);
                this.submissionError(this.state.submittingAssessment, error);
            }
        });
    }

    submissionError(facilityAssessment, error) {
        Alert.alert(
            'Submission Error',
            `An error occurred while submitting the assessment. ${error.message}`,
            [
                {
                    text: 'OK',
                    onPress: () => this.dispatchAction(Actions.ASSESSMENT_SYNCED, {facilityAssessment: facilityAssessment, ...this.props})
                }
            ]
        )
    }

    handleStartSubmit(facilityAssessment) {
        return () => this.dispatchAction(Actions.START_SUBMIT_ASSESSMENT, {facilityAssessment: facilityAssessment});
    }

    render() {
        Logger.logDebug('OpenView', 'render');
        let completedAssessments = this.state.completedAssessments.map((facilityAssessment) => this.state.syncing.indexOf(facilityAssessment.uuid) >= 0 ?
            {syncing: true, ...facilityAssessment} : facilityAssessment);
        const AssessmentLists = [
            {
                header: "SUBMIT ASSESSMENTS",
                assessments: completedAssessments,
                buttons: [
                    {
                        text: "SUBMIT",
                        shouldRender: true,
                        onPress: this.handleStartSubmit.bind(this)
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
                <Modal transparent={true} visible={!_.isNil(this.state.submittingAssessment)} onRequestClose={() => {
                }}>
                    <SubmitAssessment facilityAssessment={this.state.submittingAssessment} onSubmit={() => this.handleSubmit()}
                                      submissionDetailAvailable={this.state.submissionDetailAvailable} assessmentToolType={this.state.assessmentToolType}/>
                </Modal>
                {AssessmentLists}
            </View>
        );
    }
}

export default OpenView;