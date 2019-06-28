import React from 'react';
import {Dimensions, Modal, View} from 'react-native';
import ViewComponent from "../common/ViewComponent";
import {Button, Container, Content, Header, Icon, Title} from 'native-base';
import Typography from '../styles/Typography';
import Actions from "../../action";
import TypedTransition from "../../framework/routing/TypedTransition";
import FlatUITheme from '../themes/flatUI';
import Path from "../../framework/routing/Path";
import AssessmentStatus from './AssessmentStatus';
import Checklists from './Checklists';
import AreasOfConcern from "../areasOfConcern/AreasOfConcern";
import SubmitButton from '../common/SubmitButton';
import _ from 'lodash';
import Reports from "../reports/Reports";
import SearchPage from "../search/SearchPage";
import EnvironmentConfig from "../common/EnvironmentConfig";
import Logger from "../../framework/Logger";
import EditAssessment from "../dashboard/start/EditAssessment";
import AssessmentTitle from "../assessment/AssessmentTitle";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/checklistSelection")
class ChecklistSelection extends ViewComponent {
    constructor(props, context) {
        super(props, context, 'checklistSelection');
        this.showCompleteButton = this.showCompleteButton.bind(this);
        this.showKayakalpCompleteButton = this.showKayakalpCompleteButton.bind(this);
        this.showOtherCompleteButton = this.showOtherCompleteButton.bind(this);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_CHECKLISTS, {...this.props.params});
    }

    handleOnPress(checklist) {
        if (EnvironmentConfig.shouldTrackLocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                    Logger.logDebug('ChecklistSelection', position);
                    this.dispatchAction(Actions.CHECKLIST_ASSESSMENT_LOCATION, {
                        checklistUUID: checklist.uuid,
                        facilityAssessmentUUID: this.props.params.facilityAssessment.uuid,
                        coords: position.coords
                    });
                },
                (error) => {
                    Logger.logWarn('ChecklistSelection', 'Could not get location');
                    Logger.logWarn('ChecklistSelection', error);
                },
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 20000});
        }
        return TypedTransition.from(this).with({
            checklist: checklist,
            ...this.props.params
        }).to(AreasOfConcern);
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
        return this.state.assessmentProgress.completed > 0 || !_.isNil(checklistProgressWithValue);
    }

    showCompleteButton(mode) {
        if (EnvironmentConfig.shouldAllowIncompleteChecklistSubmission) return true;
        return mode.toLowerCase() === "kayakalp" ? this.showKayakalpCompleteButton() : this.showOtherCompleteButton();
    }

    render() {
        Logger.logDebug('ChecklistSelection', 'render');
        let assessmentComplete = this.state.assessmentProgress.completed === this.state.assessmentProgress.total;
        const showCompleteButton = this.showCompleteButton(this.props.params.mode);
        return (
            <Container theme={FlatUITheme}>
                <Header style={FlatUITheme.header}>
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
                    <Modal transparent={false} visible={this.state.showEditAssessment}
                           onRequestClose={() => this.dispatchAction(Actions.EDIT_ASSESSMENT_COMPLETED)}>
                        <EditAssessment assessmentUUID={this.props.params.facilityAssessment.uuid}/>
                    </Modal>
                    <View style={{margin: deviceWidth * 0.04, flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row'}}>
                            <AssessmentTitle facilityName={this.props.params.facility.name} assessmentStartDate={this.props.params.facilityAssessment.startDate}
                                             assessmentToolName={this.props.params.assessmentTool.name}/>
                            {/*<Button*/}
                            {/*onPress={() => {*/}
                            {/*this.dispatchAction(Actions.EDIT_ASSESSMENT_STARTED);*/}
                            {/*}}*/}
                            {/*transparent>*/}
                            {/*<Icon name={"edit"} style={{color: "white", marginTop: deviceWidth * 0.04, marginLeft: deviceWidth * 0.04}}/>*/}
                            {/*</Button>*/}
                        </View>
                        <AssessmentStatus
                            assessmentProgress={this.state.assessmentProgress}/>
                        <Checklists
                            assessmentTool={this.props.params.assessmentTool}
                            handleOnPress={this.handleOnPress.bind(this)}
                            assessmentProgress={this.state.assessmentProgress}
                            allChecklists={this.state.checklists}
                        />
                        <SubmitButton buttonStyle={{marginTop: 30, backgroundColor: '#ffa000'}}
                                      onPress={() => this.completeAssessment()}
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