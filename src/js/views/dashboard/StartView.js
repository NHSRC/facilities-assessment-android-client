import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {List, ListItem, InputGroup, Button, Radio, Picker} from 'native-base';
import Typography from '../styles/Typography';
import Dashboard from './Dashboard';
import Actions from '../../action';
import StateDistrict from './StateDistrict';
import FacilityType from './FacilityType';
import Facility from './Facility';
import AssessmentType from './AssessmentType';
import AssessmentTools from './AssessmentTools';
import StartNewAssessment from './StartNewAssessment';


const deviceWidth = Dimensions.get('window').width;


class StartView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().dashboard;
        this.unsubscribe = store.subscribeTo('facilitySelection', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        formRow: {
            borderBottomWidth: 0,
            marginLeft: 0
        },
    });


    handleChange() {
        const newState = this.context.getStore().getState().facilitySelection;
        this.setState(newState);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_STATES);
    }


    render() {
        const FormComponents =
            [StateDistrict, FacilityType, Facility, AssessmentType, AssessmentTools, StartNewAssessment]
                .map((FormComponent, idx) =>
                    <ListItem key={idx} style={StartView.styles.formRow}>
                        <FormComponent data={this.state}/>
                    </ListItem>);
        return (
            <View style={Dashboard.styles.tab}>
                <List>
                    {FormComponents}
                </List>
            </View>
        );
    }
}

export default StartView;