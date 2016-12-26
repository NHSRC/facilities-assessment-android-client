import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
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
import AssessmentTools from "../assessmentTools/AssessmentTools";


@Path("/checklistSelection")
class ChecklistSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().checklistSelection;
        this.unsubscribe = store.subscribeTo('checklistSelection', this.handleChange.bind(this));
        this.handleOnPress = this.handleOnPress.bind(this);
        this.iconColorMap = new Map([[-1, {color: PrimaryColors.textBold, icon: "create"}],
            [0, {color: PrimaryColors.yellow, icon: "error-outline"}],
            [1, {color: PrimaryColors.green, icon: "check-circle"}]]);
    }

    static styles = StyleSheet.create({
        tabContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonsContainer: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        },
        checklistButton: {
            borderColor: PrimaryColors.textBold,
            borderWidth: 2,
            margin: 10,
            width: 260
        },
        innerButton: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        buttonText: {
            color: PrimaryColors.textBold,
            fontWeight: "400",
            fontSize: 19
        },
        checklistContainer: {
            backgroundColor: PrimaryColors.background,
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().checklistSelection;
        this.setState(newState);
    }

    componentDidMount() {
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
        const allChecklists = this.state.checklists.map(this.renderChecklistButton.bind(this));
        const readyForSubmission = !this.state.checklists.some((checklist) => checklist.progress.status <= 0);
        const completedChecklistsCount = this.state.checklists.filter((checklist) => checklist.progress.status === 1).length;
        return (
            <Container theme={FlatUITheme} style={ChecklistSelection.styles.checklistContainer}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>Facilities Assessment</Title>
                </Header>
                <Content>
                    <View style={ChecklistSelection.styles.tabContainer}>
                        <AssessmentStatus dateUpdated={this.props.params.facilityAssessment.dateUpdated}
                                          completed={completedChecklistsCount}
                                          total={this.state.checklists.length}/>
                        <Text style={[ChecklistSelection.styles.buttonText, Typography.paperFontDisplay1]}>
                            Select a Checklist
                        </Text>
                        <View style={ChecklistSelection.styles.buttonsContainer}>
                            {allChecklists}
                        </View>
                        {this.renderSubmitButton(readyForSubmission)}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistSelection;