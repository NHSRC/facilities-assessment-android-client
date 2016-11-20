import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {Card, CardItem, ListItem} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import Checkpoint from './Checkpoint';
import _ from 'lodash';


class MeasurableElement extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        meHeader: {
            backgroundColor: PrimaryColors.lightBlue
        },
        meHeaderText: {
            color: PrimaryColors.background
        },
    });

    render() {
        const checkpoints = this.props.data.checkpoints.map((checkpoint, idx)=>
            <Checkpoint key={idx} data={checkpoint}/>);
        return (
            <ListItem>
                <Card>
                    <CardItem header style={MeasurableElement.styles.meHeader}>
                        <Text style={MeasurableElement.styles.meHeaderText}>
                            {`${this.props.data.reference}: ${this.props.data.name}`}
                        </Text>
                    </CardItem>
                    {checkpoints}
                </Card>
            </ListItem>
        );
    }
}

export default MeasurableElement;


