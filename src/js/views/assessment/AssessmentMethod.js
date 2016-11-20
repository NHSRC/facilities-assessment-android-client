import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, CheckBox} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


class AssessmentMethod extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        body: {
            flex: 5,
            justifyContent: 'flex-start',
            flexDirection: 'row'
        },
        button: {
            flex: 1,
            alignItems: 'flex-start',
        },
        text: {
            color: PrimaryColors.textBold,
            alignSelf: 'flex-start',
        },
        title: {
            color: PrimaryColors.textBold,
            alignSelf: 'flex-start',
        }
    });

    render() {
        return (
            <ListItem style={AssessmentMethod.styles.body}>
                <View style={AssessmentMethod.styles.button}>
                    <Text style={AssessmentMethod.styles.text}>Assessment Method</Text>
                </View>
                <View style={AssessmentMethod.styles.button}>
                    <CheckBox checked={true}/>
                    <Text style={AssessmentMethod.styles.text}>OB</Text>
                </View>
                <View style={AssessmentMethod.styles.button}>
                    <CheckBox checked={false}/>
                    <Text style={AssessmentMethod.styles.text}>RR</Text>
                </View>
                <View style={AssessmentMethod.styles.button}>
                    <CheckBox checked={false}/>
                    <Text style={AssessmentMethod.styles.text}>PI</Text>
                </View>
                <View style={AssessmentMethod.styles.button}>
                    <CheckBox checked={false}/>
                    <Text style={AssessmentMethod.styles.text}>SI</Text>
                </View>
            </ListItem>
        );
    }
}

export default AssessmentMethod;