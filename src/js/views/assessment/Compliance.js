import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, Radio} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


class Compliance extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        complianceBody: {
            flex: 4,
            justifyContent: 'flex-start',
            flexDirection: 'row'
        },
        button: {
            flex: 1,
            alignItems: 'flex-start',
        },
        text: {
            color: PrimaryColors.textBold,
            alignSelf: 'center'
        },
        title: {
            color: PrimaryColors.textBold,
            alignSelf: 'flex-start'
        }
    });

    render() {
        return (
            <ListItem style={Compliance.styles.complianceBody}>
                <View style={Compliance.styles.button}>
                    <Text style={Compliance.styles.title}>Compliance</Text>
                </View>
                <View style={Compliance.styles.button}>
                    <Radio style={{alignSelf: 'center'}} selected={true}/>
                    <Text style={Compliance.styles.text}>Non Compliant</Text>
                </View>
                <View style={Compliance.styles.button}>
                    <Radio style={{alignSelf: 'center'}} selected={false}/>
                    <Text style={Compliance.styles.text}>Partially Compliant</Text>
                </View>
                <View style={Compliance.styles.button}>
                    <Radio style={{alignSelf: 'center'}} selected={false}/>
                    <Text style={Compliance.styles.text}>Fully Compliant</Text>
                </View>
            </ListItem>
        );
    }
}

export default Compliance;