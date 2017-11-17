import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, Alert} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import Actions from "../../action";
import TypedTransition from "../../framework/routing/TypedTransition";
import FlatUITheme from '../themes/flatUI';
import Path from "../../framework/routing/Path";
import AssessmentStatus from './AssessmentStatus';
import Checklists from './Checklists';
import AreasOfConcern from "../areasOfConcern/AreasOfConcern";
import SubmitButton from '../common/SubmitButton';
import Dashboard from '../dashboard/Dashboard';
import {formatDateHuman} from '../../utility/DateUtils';
import _ from 'lodash';
import Reports from "../reports/Reports";
import SearchPage from "../search/SearchPage";
import Config from "react-native-config";
import EnvironmentConfig from "../common/EnvironmentConfig";
import Logger from "../../framework/Logger";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/checklistSelection")
class ChecklistSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().checklistSelection;
        this.unsubscribe = store.subscribeTo('checklistSelection', this.handleChange.bind(this));
        this.showCompleteButton = this.showCompleteButton.bind(this);
        this.showKayakalpCompleteButton = this.showKayakalpCompleteButton.bind(this);
        this.showOtherCompleteButton = this.showOtherCompleteButton.bind(this);
    }

    static styles = StyleSheet.create({
        subheader: {
            color: "white",
            marginTop: deviceHeight * 0.0125
        },
        caption: {
            color: "rgba(255,255,255,0.7)"
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().checklistSelection;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_CHECKLISTS, {...this.props.params});
    }

    handleOnPress(checklist) {
        return () => TypedTransition.from(this).with({
            checklist: checklist,
            ...this.props.params
        }).to(AreasOfConcern);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    completeAssessment() {
        this.dispatchAction(Actions.COMPLETE_ASSESSMENT, {
            cb: () => TypedTransition.from(this).with({
                assessmentTool: this.props.params.facilityAssessment.assessmentTool,
                facility: this.props.params.facilityAssessment.facility,
                assessmentType: this.props.params.facilityAssessment.assessmentType,
                facilityAssessment: this.props.params.facilityAssessment,
                ...this.props.params
            }).to(Reports),
            ...this.props.params
        });
        this.dispatchAction(Actions.ALL_ASSESSMENTS, {mode: this.props.params.mode});
    }

    showKayakalpCompleteButton() {
        return _.some(this.state.checklists, (checklist) => checklist.progress.completed > 0);
    }

    showOtherCompleteButton() {
        let checklistProgressWithValue = this.state.checklists.find((checklist) => {
            return !_.isNil(checklist.progress.total);
        });
        return EnvironmentConfig.shouldAllowIncompleteChecklistSubmission
            && (this.state.assessmentProgress.completed > 0 || !_.isNil(checklistProgressWithValue));
    }

    showCompleteButton(mode) {
        return mode.toLowerCase() === "kayakalp" ? this.showKayakalpCompleteButton() : this.showOtherCompleteButton();
    }

    render() {
        Logger.logDebug('ChecklistSelection', 'render');
        let assessmentComplete = this.state.assessmentProgress.completed === this.state.assessmentProgress.total;
        const showCompleteButton = this.showCompleteButton(this.props.params.mode);
        return (
            <Container theme={FlatUITheme}>
                <Header style={Dashboard.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{color: "white"}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline,
                        {fontWeight: 'bold', color: "white"}]}>
                        Assessment
                    </Title>
                    <Button transparent
                            onPress={() => TypedTransition.from(this).with({...this.props.params}).to(SearchPage)}>
                        <Icon style={{color: "white"}} name='search'/>
                    </Button>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Text style={[Typography.paperFontHeadline, ChecklistSelection.styles.subheader]}>
                            {this.props.params.facility.name}
                        </Text>
                        <Text style={[Typography.paperFontCaption, ChecklistSelection.styles.caption]}>
                            {this.props.params.assessmentTool.name}
                        </Text>
                        <Text style={[Typography.paperFontCaption, ChecklistSelection.styles.caption]}>
                            {`Assessment Start Date - ${formatDateHuman(this.props.params.facilityAssessment.startDate)}`}
                        </Text>
                        <AssessmentStatus
                            assessmentProgress={this.state.assessmentProgress}/>
                        <Checklists
                            assessmentTool={this.props.params.assessmentTool}
                            handleOnPress={this.handleOnPress.bind(this)}
                            assessmentProgress={this.state.assessmentProgress}
                            allChecklists={this.state.checklists}
                        />
                        <SubmitButton buttonStyle={{marginTop: 30, backgroundColor: '#ffa000'}}
                                      onPress={this.completeAssessment.bind(this)}
                                      buttonText={assessmentComplete ? "COMPLETE ASSESSMENT" : "GENERATE SCORECARD"}
                                      showButton={showCompleteButton}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistSelection;