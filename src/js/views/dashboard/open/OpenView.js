import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from '../../../action';
import Dashboard from '../Dashboard';
import AssessmentList from './AssessmentList';
import _ from 'lodash';


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
        this.dispatchAction(Actions.ALL_ASSESSMENTS);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const AssessmentLists = [
            {
                header: "SUBMIT ASSESSMENTS",
                assessments: this.state.completedAssessments,
                buttonText: "SUBMIT"
            },
            {
                header: "OPEN ASSESSMENTS",
                assessments: this.state.openAssessments,
                buttonText: "CONTINUE"
            },
            {
                header: "SUBMITTED ASSESSMENTS",
                assessments: this.state.submittedAssessments,
                buttonText: "VIEW"
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