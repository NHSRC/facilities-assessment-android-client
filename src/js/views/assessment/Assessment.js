import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path from '../../framework/routing/Path';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Tabs, Footer, FooterTab, Button} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";

@Path("/assessment")
class Assessment extends AbstractComponent {
    render() {
        return (
            <View>
                <Text>{this.props.params.selectedDepartment}</Text>
            </View>
        );
    }
}

export default Assessment;