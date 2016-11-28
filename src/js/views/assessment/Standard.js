import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {Icon, List, ListItem} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import MeasurableElement from './MeasurableElement';


class Standard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({});

    render() {
        const measurableElements = this.props.data.measurableElements.map((me, idx)=>
            <MeasurableElement assessment={this.props.assessment} key={idx} data={me}/>);
        return (
            <List>
                {measurableElements}
            </List>
        );
    }
}

export default Standard;