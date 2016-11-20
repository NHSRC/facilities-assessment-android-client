import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {CardItem, List, ListItem} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import Compliance from './Compliance';
import AssessmentMethod from './AssessmentMethod';
import Remarks from './Remarks';

class Checkpoint extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        question: {
            alignSelf: 'center',
            color: PrimaryColors.textBold,
            fontSize: 15
        },
    });

    render() {
        return (
            <CardItem cardBody>
                <List>
                    <ListItem>
                        <Text style={Checkpoint.styles.question}>{this.props.data.name}</Text>
                    </ListItem>
                    <Compliance data={this.props.data}/>
                    <AssessmentMethod data={this.props.data}/>
                    <Remarks data={this.props.data}/>
                </List>
            </CardItem>
        );
    }
}

export default Checkpoint;