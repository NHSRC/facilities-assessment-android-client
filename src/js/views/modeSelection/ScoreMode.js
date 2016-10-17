import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Tabs} from 'native-base';
import FlatUITheme from '../themes/flatUI';

class ScoreMode extends AbstractComponent {
    render() {
        return (
            <View style={{flex: 1}}>
                <Text>In Score mode</Text>
            </View>
        );
    }
}

export default ScoreMode;