import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path, {PathRoot} from '../../framework/routing/Path';
import FlatUITheme from '../themes/flatUI';
import AbstractComponent from "../common/AbstractComponent";
import {Header, Container, Content, Title, Icon, Button} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import PickerList from './PickerList';
import SubmitButton from "../common/SubmitButton";
import TypedTransition from "../../framework/routing/TypedTransition";
import ModeSelection from "../modeSelection/ModeSelection";

@PathRoot
@Path("/facilitySelection")
class FacilitySelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().facilitySelection;
        this.unsubscribe = store.subscribeTo('facilitySelection', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        facilitySelectionContainer: {
            backgroundColor: PrimaryColors.background
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().facilitySelection;
        new Map([[true, this.changeView.bind(this)], [false, this.updateState.bind(this)]]).get(newState.facilitySelected)(newState);
    }

    updateState(newState) {
        this.setState(newState);
    }

    changeView() {
        this.dispatchAction(Actions.RESET_FORM, {
            cb: ()=>TypedTransition.from(this).with({
                selectedAssessmentType: {
                    "name": "Urban Primary Health Center",
                    "uuid": "9ad6d761-46ab-412e-ba63-a1b836cb1bf1"
                },
                selectedFacility: this.state.selectedFacility
            }).to(ModeSelection)
        })
    }

    getPickers() {
        return [
            {
                "selectedValue": this.state.selectedState,
                "items": this.state.allStates,
                "stateKey": "selectedState",
                "action": Actions.SELECT_STATE,
                "message": "Select a state",
                "label": "State"
            },
            {
                "selectedValue": this.state.selectedDistrict,
                "items": this.state.districtsForState,
                "stateKey": "selectedDistrict",
                "action": Actions.SELECT_DISTRICT,
                "message": "Select a district",
                "label": "District"
            },
            {
                "selectedValue": this.state.selectedFacility,
                "items": this.state.facilities,
                "stateKey": "selectedFacility",
                "action": Actions.SELECT_FACILITY,
                "message": "Select a Facility",
                "label": "Facility"
            },
            {
                "selectedValue": this.state.selectedAssessmentType,
                "items": this.state.assessmentTypes,
                "stateKey": "selectedAssessmentType",
                "action": Actions.SELECT_ASSESSMENT_TYPE,
                "message": "Select an Assessment Type",
                "label": "Assessment Type"
            }
        ];
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        this.dispatchAction(Actions.ALL_STATES);
    }

    renderSubmitButton() {
        if (!_.isNil(this.state.selectedAssessmentType)|| true) {
            return (
                <SubmitButton buttonIcon="launch" onPress={()=>this.dispatchAction(Actions.FACILITY_SELECT)}
                              buttonText={"Go"}/>);
        }
    }

    render() {
        const pickersToRender = this.getPickers().filter((picker)=> !_.isEmpty(picker.items) || !_.isNil(picker.items));
        return (
            <Container theme={FlatUITheme} style={FacilitySelection.styles.facilitySelectionContainer}>
                <Header>
                    <Title>Facilities Assessment</Title>
                </Header>
                <Content>
                    <PickerList pickers={pickersToRender}/>
                    {this.renderSubmitButton()}
                </Content>
            </Container>
        );
    }
}

export default FacilitySelection;