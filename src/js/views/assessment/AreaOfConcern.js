import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {Icon, List, ListItem, Button} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import Accordion from 'react-native-collapsible/Accordion';
import Standard from './Standard';

class AreaOfConcern extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        standardIcon: {
            fontSize: 30,
        },
        standardText: {
            fontSize: 20,
        },
        sectionHeader: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    });


    renderHeader(standard, index, isActive) {
        return (
            <View style={[AreaOfConcern.styles.sectionHeader,
                {backgroundColor: PrimaryColors.yellow}]}>
                <Text style={[AreaOfConcern.styles.standardText,
                    {color: PrimaryColors.textBold}]}>
                    {`${standard.reference}: ${standard.name}`}
                </Text>
                <Icon name={isActive ? "expand-less" : "expand-more"}
                      style={[AreaOfConcern.styles.standardIcon,
                          {color: PrimaryColors.textBold}]}/>
            </View>
        );
    }

    renderContent(standard, index, isActive) {
        return (<Standard assessment={this.props.assessment} data={standard}/>);
    }

    render() {
        return (
            <Accordion
                sections={this.props.data.standards}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent.bind(this)}/>
        );
    }
}

export default AreaOfConcern;