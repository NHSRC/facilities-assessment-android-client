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
        this.dispatchAction(Actions.ALL_CHECKLISTS, {assessmentTool: this.props.params.selectedAssessmentTool});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(checklist) {
        return ()=>TypedTransition.from(this).with({
            selectedChecklist: checklist,
            facility: this.props.params.selectedFacility,
            assessmentType: this.props.params.selectedAssessmentType
        }).to(Assessment);
    }

    render() {
        const allChecklists = this.state.checklists.map((checklist, idx)=>
            (<Button key={idx} onPress={this.handleOnPress(checklist)} style={ChecklistSelection.styles.checklistButton}
                     bordered large info>
                <View style={ChecklistSelection.styles.innerButton}>
                    <Text style={ChecklistSelection.styles.buttonText}>
                        {checklist.name}
                    </Text>
                    <MedIcon style={ChecklistSelection.styles.buttonText}
                             size={25} name={iconMapping[checklist.department.name]}/>
                </View>
            </Button>)
        );
        return (
            <Container theme={FlatUITheme} style={ChecklistSelection.styles.checklistContainer}>
                <Header>
                    <Button transparent onPress={()=>TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>Facilities Assessment</Title>
                </Header>
                <Content>
                    <View style={ChecklistSelection.styles.tabContainer}>
                        <Text style={[ChecklistSelection.styles.buttonText, Typography.paperFontDisplay1]}>
                            Select a Checklist
                        </Text>
                        <View style={ChecklistSelection.styles.buttonsContainer}>
                            {allChecklists}
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistSelection;