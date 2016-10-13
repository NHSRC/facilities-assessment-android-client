import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path from '../../framework/routing/Path';
import FlatUITheme from '../themes/flatUI';
import AbstractComponent from "../common/AbstractComponent";
import {Header, Container, Content, Title, Button, Icon} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import Actions from '../../action';
import PickerList from './PickerList';
import SubmitButton from "../common/SubmitButton";
import TypedTransition from "../../framework/routing/TypedTransition";
import Checklist from "../checklist/Checklist";

@Path("/facilitySelection")
class FacilitySelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().facilitySelection;
        this.unsubscribe = store.subscribe(this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        facilitySelectionContainer: {
            backgroundColor: PrimaryColors.background
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().facilitySelection;
        new Map([[true, this.changeView.bind(this)], [false, this.updateState.bind(this)]]).get(newState.facilitySelected)(newState);
        this.setState(newState);
    }

    updateState(newState) {
        this.setState(newState);
    }

    changeView() {
        TypedTransition.from(this).to(Checklist);
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
                "selectedValue": this.state.selectedFacilityType,
                "items": this.state.facilityTypes,
                "stateKey": "selectedFacilityType",
                "action": Actions.SELECT_FACILITY_TYPE,
                "message": "Select a Facility Type",
                "label": "Facility Type"
            },
            {
                "selectedValue": this.state.selectedFacility,
                "items": this.state.facilities,
                "stateKey": "selectedFacility",
                "action": Actions.SELECT_FACILITY,
                "message": "Select a Facility",
                "label": "Facility"
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
        if (!_.isNil(this.state.selectedFacility)) {
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