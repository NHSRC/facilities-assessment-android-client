import React from "react";
import {StyleSheet, View} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import {List, ListItem} from "native-base";
import Dashboard from "../Dashboard";
import Actions from "../../../action";
import StateDistrict from "./StateDistrict";
import FacilityType from "./FacilityType";
import Facility from "./Facility";
import AssessmentType from "./AssessmentType";
import AssessmentTools from "./AssessmentTools";
import StartNewAssessment from "./StartNewAssessment";
import TypedTransition from "../../../framework/routing/TypedTransition";
import ChecklistSelection from "../../checklistSelection/ChecklistSelection";
import FacilityText from "./FacilityText";
import AssessmentSeries from "./AssessmentSeries";
import EnvironmentConfig from "../../common/EnvironmentConfig";
import Logger from "../../../framework/Logger";

class StartView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().facilitySelection;
        this.unsubscribe = store.subscribeTo('facilitySelection', this.handleChange.bind(this));
        this.changeView = this.changeView.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    static styles = StyleSheet.create({
        formRow: {
            borderBottomWidth: 0,
            marginLeft: 0,
        },
    });


    handleChange() {
        const newState = this.context.getStore().getState().facilitySelection;
        (newState.facilitySelected ? this.changeView.bind(this) : this.setState.bind(this))(newState);
    }

    changeView(newState) {
        this.dispatchAction(Actions.RESET_FORM, {
            cb: () =>
                TypedTransition.from(this).with({
                    assessmentTool: this.state.selectedAssessmentTool,
                    facility: newState.selectedFacility,
                    assessmentType: this.state.selectedAssessmentType,
                    facilityAssessment: newState.facilityAssessment,
                    state: this.state.selectedState,
                    ...this.props
                }).to(ChecklistSelection)
        })
    }

    resetForm() {
        this.dispatchAction(Actions.RESET_FORM, {
            cb: () => {
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_STATES, {...this.props});
    }

    render() {
        Logger.logDebug('StartView', 'render');
        const FormComponents = [AssessmentTools, StateDistrict, FacilityType, Facility];
        if (EnvironmentConfig.isFreeTextFacilityNameSupported && _.isNil(this.state.selectedFacility))
            FormComponents.push(FacilityText);
        FormComponents.push(AssessmentSeries);
        FormComponents.push(AssessmentType);
        FormComponents.push(StartNewAssessment);

        return (
            <View style={Dashboard.styles.tab}>
                <List>
                    {FormComponents.map((FormComponent, idx) =>
                        <ListItem key={idx} style={StartView.styles.formRow}>
                            <FormComponent data={this.state} {...this.props}/>
                        </ListItem>)}
                </List>
            </View>
        );
    }
}

export default StartView;