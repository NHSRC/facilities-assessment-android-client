import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import MedIcon from '../styles/MedIcons';
import Actions from "../../action";
import iconMapping from '../styles/departmentIconMapping.json';
import TypedTransition from "../../framework/routing/TypedTransition";
import Assessment from '../assessment/Assessment';


class AssessmentMode extends AbstractComponent {
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
        deptButton: {
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
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().checklistSelection;
        this.setState(newState);
    }

    componentDidMount() {
        this.dispatchAction(Actions.ALL_CHECKLISTS, {assessmentType: this.props.assessmentType});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOnPress(checklist) {
        return ()=>TypedTransition.from(this).with({
            selectedChecklist: checklist,
            checklists: this.state.checklists
        }).to(Assessment);
    }

    render() {
        const allChecklists = this.state.checklists.map((checklist, idx)=>
            (<Button key={idx} onPress={this.handleOnPress(checklist)} style={AssessmentMode.styles.deptButton}
                     bordered large info>
                <View style={AssessmentMode.styles.innerButton}>
                    <Text style={AssessmentMode.styles.buttonText}>
                        {checklist.name}
                    </Text>
                    <MedIcon style={AssessmentMode.styles.buttonText}
                             size={25} name={iconMapping[checklist.name]}/>
                </View>
            </Button>)
        );
        return (
            <View style={AssessmentMode.styles.tabContainer}>
                <Text style={[AssessmentMode.styles.buttonText, Typography.paperFontDisplay1]}>
                    Select a Department
                </Text>
                <View style={AssessmentMode.styles.buttonsContainer}>
                    {allChecklists}
                </View>
            </View>
        );
    }
}

export default AssessmentMode;