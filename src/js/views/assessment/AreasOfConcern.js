import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import Accordion from 'react-native-collapsible/Accordion';
import {Icon} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import AreaOfConcern from './AreaOfConcern';

class AreasOfConcern extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        aocIcon: {
            fontSize: 45
        },
        aocText: {
            fontSize: 30,
        },
        sectionHeader: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
    });


    renderHeader(aoc, index, isActive) {
        return (
            <View style={[AreasOfConcern.styles.sectionHeader,
                {backgroundColor: index % 2 === 0 ? PrimaryColors.background : PrimaryColors.darkBlue}]}>
                <Text style={[AreasOfConcern.styles.aocText,
                    {color: index % 2 === 0 ? PrimaryColors.textBold : PrimaryColors.background}]}>
                    {`${aoc.reference}: ${aoc.name}`}
                </Text>
                <Icon name={isActive ? "expand-less" : "expand-more"}
                      style={[AreasOfConcern.styles.aocIcon,
                          {color: index % 2 === 0 ? PrimaryColors.textBold : PrimaryColors.background}]}/>
            </View>
        );
    }

    renderContent(aoc, index, isActive) {
        return (
            <AreaOfConcern data={aoc}/>
        );
    }

    render() {
        return (
            <Accordion
                initiallyActiveSection={0}
                sections={this.props.areasOfConcern}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}/>
        );
    }
}

export default AreasOfConcern;