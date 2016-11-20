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
                {backgroundColor: index % 2 === 0 ? PrimaryColors.darkBlue : PrimaryColors.background}]}>
                <Text style={[AreaOfConcern.styles.standardText,
                    {color: index % 2 === 0 ? PrimaryColors.background : PrimaryColors.textBold}]}>
                    {`${standard.reference}: ${standard.name}`}
                </Text>
                <Icon name={isActive ? "expand-less" : "expand-more"}
                      style={[AreaOfConcern.styles.standardIcon,
                          {color: index % 2 === 0 ? PrimaryColors.background : PrimaryColors.textBold}]}/>
            </View>
        );
    }

    renderContent(standard, index, isActive) {
        return (<Standard data={standard}/>);
    }

    render() {
        return (
            <Accordion
                sections={this.props.data.standards}
                initiallyActiveSection={0}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}/>
        );
    }
}

export default AreaOfConcern;