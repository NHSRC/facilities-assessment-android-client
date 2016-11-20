import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {CardItem} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


class Checkpoint extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({});

    render() {
        return (
            <CardItem cardBody>
                <Text>{this.props.data.name}</Text>
            </CardItem>
        );
    }
}

export default Checkpoint;