import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path from '../../framework/routing/Path';
import AbstractComponent from "../common/AbstractComponent";

@Path("/checklist")
class Checklist extends AbstractComponent {
    render() {
        return (
            <Text>Hello World</Text>
        );
    }
}

export default Checklist;