import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import MedIcon from '../styles/MedIcons';
import Actions from "../../action";
import iconMapping from '../styles/departmentIconMapping.json';
import TypedTransition from "../../framework/routing/TypedTransition";
import Assessment from '../assessment/Assessment';
import FlatUITheme from '../themes/flatUI';
import Path from "../../framework/routing/Path";
import SubmitButton from '../common/SubmitButton';
import AssessmentStatus from './AssessmentStatus';
import Checklists from './Checklists';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/checklistSelection")
class ChecklistSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().checklistSelection;
        this.unsubscribe = store.subscribeTo('checklistSelection', this.handleChange.bind(this));
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    static styles = StyleSheet.create({
        subheader: {
            color: PrimaryColors.subheader_black,
            marginTop: deviceHeight * 0.0125
        },
        caption: {
            color: PrimaryColors.caption_black
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().checklistSelection;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_CHECKLISTS, {
            assessmentTool: this.props.params.selectedAssessmentTool,
            facilityAssessment: this.props.params.facilityAssessment
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(checklist) {
        return () => TypedTransition.from(this).with({
            selectedChecklist: checklist,
            facility: this.props.params.selectedFacility,
            assessmentType: this.props.params.selectedAssessmentType,
            facilityAssessment: this.props.params.facilityAssessment
        }).to(Assessment);
    }

    renderSubmitButton(show) {
        if (show) {
            return (
                <SubmitButton onPress={() => this.dispatchAction(Actions.SAVE_FACILITY_ASSESSMENT, {
                    assessment: this.props.params.facilityAssessment,
                    cb: () => TypedTransition.from(this).to(AssessmentTools)
                })}
                              buttonText="Save Assessment" buttonIcon="save"/>
            );
        }
    }


    renderChecklistButton(checklist, idx) {
        return (<Button key={idx} onPress={this.handleOnPress(checklist)}
                        style={[ChecklistSelection.styles.checklistButton,
                            {borderColor: this.iconColorMap.get(checklist.progress.status).color}]}
                        bordered large info>
            <View style={ChecklistSelection.styles.innerButton}>
                <MedIcon
                    style={[ChecklistSelection.styles.buttonText,
                        {color: this.iconColorMap.get(checklist.progress.status).color}]}
                    size={25} name={iconMapping[checklist.department.name]}/>
                <Text
                    style={[ChecklistSelection.styles.buttonText,
                        {color: this.iconColorMap.get(checklist.progress.status).color}]}>
                    {checklist.name}
                </Text>
                <Icon style={{color: this.iconColorMap.get(checklist.progress.status).color}} size={25}
                      name={this.iconColorMap.get(checklist.progress.status).icon}/>
            </View>
        </Button>);
    }

    render() {
        // const allChecklists = this.state.checklists.map(this.renderChecklistButton.bind(this));
        // const readyForSubmission = !this.state.checklists.some((checklist) => checklist.progress.status <= 0);
        const completedChecklistsCount = this.state.checklists.filter((checklist) => checklist.progress.status === 1).length;
        return (
            <Container theme={FlatUITheme} style={ChecklistSelection.styles.checklistContainer}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>Assessment</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Text style={[Typography.paperFontHeadline, ChecklistSelection.styles.subheader]}>
                            {this.props.params.selectedFacility.name}
                        </Text>
                        <Text style={[Typography.paperFontCaption, ChecklistSelection.styles.caption]}>
                            {this.props.params.selectedAssessmentTool.name}
                        </Text>
                        <AssessmentStatus
                            total={this.state.checklists.length}
                            completed={completedChecklistsCount}/>
                        <Checklists
                            total={this.state.checklists.length}
                            completed={completedChecklistsCount}
                            allChecklists={this.state.checklists}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistSelection;