import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, InputGroup, Input} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


class Remarks extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        body: {
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        text: {
            marginTop: 5,
            color: PrimaryColors.textBold,
        },
        input: {
            marginLeft: 10,
            flex: 1,
            alignSelf: 'flex-end'
        }
    });

    render() {
        return (
            <ListItem>
                <View style={Remarks.styles.body}>
                    <Text style={Remarks.styles.text}>Remarks</Text>
                    <InputGroup style={Remarks.styles.input} borderType="regular">
                        <Input placeholder=""/>
                    </InputGroup>
                </View>
            </ListItem>
        );
    }
}

export default Remarks;