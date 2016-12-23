import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView, ProgressBarAndroid as ProgressBar} from "react-native";
import Path from "../../framework/routing/Path";
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from "native-base";
import AreasOfConcern from './AreasOfConcern';
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from "../themes/flatUIAssessment";
import Actions from "../../action";
import SubmitButton from '../common/SubmitButton';
import TypedTransition from "../../framework/routing/TypedTransition";
import _ from 'lodash';
import AssessmentStatus from './AssessmentStatus';

@Path("/assessment")
class Assessment extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().assessment;
        store.subscribeTo('assessment', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        assessmentContainer: {
            backgroundColor: PrimaryColors.background
        },
        textColor: {
            color: PrimaryColors.textBold
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().assessment;
        this.setState(newState);
    }

    componentDidMount() {
        this.dispatchAction(Actions.START_CHECKLIST_ASSESSMENT, {
            checklist: this.props.params.selectedChecklist,
            assessmentType: this.props.params.assessmentType,
            facility: this.props.params.facility,
            facilityAssessment: this.props.params.facilityAssessment
        });
    }

    render() {
        const progressRatio = this.state.progress.completed / this.state.progress.total;
        const assessmentSubmitted = !_.isEmpty(this.state.assessment.endDate);
        return (
            <Container theme={FlatUITheme} style={Assessment.styles.assessmentContainer}>
                <Header>
                    <Button transparent onPress={()=>TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>{this.state.checklist.name}</Title>
                </Header>
                <View style={{flex: 1}}>
                    <AssessmentStatus assessment={this.state.assessment} progress={this.state.progress}
                                      progressRatio={progressRatio} assessmentSubmitted={assessmentSubmitted}/>
                    <ScrollView>
                        <AreasOfConcern
                            currentPointer={this.state.currentPointer}
                            assessment={this.state.assessment}
                            areasOfConcern={this.state.checklist.areasOfConcern}/>
                    </ScrollView>
                </View>
            </Container>

        );
    }
}

export default Assessment;