import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {Icon, ListItem} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";

class Standard extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        standardIcon: {
            fontSize: 45
        },
        standardText: {
            fontSize: 30,
            color: PrimaryColors.textBold
        }
    });

    onPress() {
        return this.dispatchAction(Actions.EXPAND_STANDARD, {expandStandard: this.props.standard});
    }

    render() {
        return (
            <View>
                <ListItem itemDivider button iconLeft onPress={this.onPress}>
                    <Icon name={this.props.standard.visible ? "expand-less" : "expand-more"}
                          style={Standard.styles.standardIcon}/>
                    <Text style={Standard.styles.standardText}>
                        {`${this.props.standard.reference}: ${this.props.standard.name}`}
                    </Text>
                </ListItem>
            </View>
        );
    }
}

export default Standard;