import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {Thumbnail} from 'native-base';
import _ from 'lodash';
import AbstractComponent from "../../common/AbstractComponent";
import Dashboard from '../Dashboard';
import Actions from '../../../action';
import AssessmentList from '../common/AssessmentList';
import Reports from '../../reports/Reports';
import TypedTransition from "../../../framework/routing/TypedTransition";
const comingSoon = require('../../img/coming_soon.jpeg');

const deviceWidth = Dimensions.get('window').width;

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
        this.dispatchAction(Actions.ALL_ASSESSMENTS, {...this.props});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    showReports(assessment) {
        return () => TypedTransition.from(this).with({
            assessmentTool: assessment.assessmentTool,
            facility: assessment.facility,
            assessmentType: assessment.assessmentType,
            facilityAssessment: assessment,
            ...this.props
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
                <Text style={{color: 'white', fontSize: 36, alignSelf: 'center'}}>Coming Soon</Text>
                <Thumbnail size={deviceWidth * .9}
                           style={{alignSelf: 'center'}}
                           resizeMode="contain"
                           source={comingSoon}/>
            </View>
        );
    }
}

export default ReportsView;