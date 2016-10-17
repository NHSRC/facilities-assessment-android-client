import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Card, CardItem} from 'native-base';
import FlatUITheme from '../themes/flatUI';
import Actions from "../../action";

class AssessmentMode extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().departmentSelection;
        this.unsubscribe = store.subscribeTo('departmentSelection', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        tabContainer: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().departmentSelection;
        this.setState(newState);
    }

    componentDidMount() {
        this.dispatchAction(Actions.ALL_DEPARTMENTS, {facilityName: this.props.facilityName});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const allDepts = this.state.allDepartments.map((dept, idx)=>(<Text key={idx}>{dept}</Text>));
        return (
            <View style={AssessmentMode.styles.tabContainer}>
                {allDepts}
            </View>
        );
    }
}

export default AssessmentMode;