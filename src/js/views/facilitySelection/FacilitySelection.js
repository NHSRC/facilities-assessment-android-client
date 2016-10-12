import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path, {PathRoot} from '../../framework/routing/Path';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AbstractComponent from "../common/AbstractComponent";
import TypedTransition from "../../framework/routing/TypedTransition";

@Path("/facilitySelection")
class FacilitySelection extends AbstractComponent {
    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Hello World</Text>
            </View>);
    }
}

export default FacilitySelection;