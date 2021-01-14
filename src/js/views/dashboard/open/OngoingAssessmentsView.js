import React from 'react';
import {Alert, Modal} from 'react-native';
import {View} from 'native-base';
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
import AssessmentTool from "../../../models/AssessmentTool";
import AssessmentSummary from "../../assessment/AssessmentSummary";

class OngoingAssessmentsView extends AbstractComponent {
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

    handleStartSubmit(facilityAssessment) {
        return () => this.dispatchAction(Actions.LAUNCH_SUBMIT_ASSESSMENT, {facilityAssessment: facilityAssessment});
    }


    handleSummary(facilityAssessment) {
        return () => this.dispatchAction(Actions.GET_ASSESSMENT_SUMMARY, {
            facilityAssessment: facilityAssessment, cb: (assessmentSummary) => {
                this.dispatchAction(Actions.ASSESSMENT_SUMMARY_LOADED, {assessmentSummary: assessmentSummary});
            }, errorHandler: (error) => {
                Logger.logError('OngoingAssessmentsView', error);
                this.summaryLoadFailed(error);
            }
        });
    }

    summaryLoadFailed(facilityAssessment, error) {
        Alert.alert(
            'Summary Load Failed',
            `${error.message}`,
            [
                {
                    text: 'OK',
                    onPress: () => this.dispatchAction(Actions.ASSESSMENT_SUMMARY_LOAD_FAILED)
                }
            ]
        )
    }

    render() {
        Logger.logDebug('OngoingAssessmentsView', 'render');
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
                    {
                        text: "SUMMARY",
                        onPress: this.handleSummary.bind(this)
                    }
                ]
            }
        ].filter(({assessments}) => !_.isEmpty(assessments))
            .map((assessmentList, key) =>
                <AssessmentList key={key} {...assessmentList}/>);
        return (
            <View style={Dashboard.styles.tab}>
                {this.state.submittingAssessment && <SubmitAssessment facilityAssessment={this.state.chosenAssessment} syncing={this.state.syncing.length >= 1}/>}
                {this.state.assessmentSummary && <AssessmentSummary summary={this.state.assessmentSummary}/>}
                {AssessmentLists}
            </View>
        );
    }
}

export default OngoingAssessmentsView;