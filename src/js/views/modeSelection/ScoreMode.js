import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Tabs} from 'native-base';
import FlatUITheme from '../themes/flatUI';
import ChecklistService from "../../service/ChecklistService";

class ScoreMode extends AbstractComponent {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        const checklistService = this.context.getService(ChecklistService);
        return (
            <View style={{flex: 1}}>
                <Text>In Score mode</Text>
            </View>
        );
    }
}

export default ScoreMode;