import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, InputGroup, Input, Icon} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


class Remarks extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        input: {
            alignSelf: 'flex-start',
            borderColor: PrimaryColors.textBold,
            marginTop: 10,
        }
    });

    render() {
        return (
            <View style={{flex: 1, alignItems: 'stretch'}}>
                <InputGroup borderType='regular' style={Remarks.styles.input}>
                    <Icon size={5} name={"note-add"}/>
                    <Input placeholder="Remarks"/>
                </InputGroup>
            </View>
        );
    }
}

export default Remarks;