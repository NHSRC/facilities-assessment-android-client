import React, {Component} from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import {Icon, Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import MedIcon from '../styles/MedIcons';
import Actions from "../../action";

class DashboardItem extends AbstractComponent {
    static styles = StyleSheet.create({
        dashboardItemButton: {
            borderColor: PrimaryColors.textBold,
            borderWidth: 2,
            margin: 10,
            width: 260
        },
        innerButton: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        buttonText: {
            color: PrimaryColors.textBold,
            fontWeight: "400",
            fontSize: 19
        }
    });

    render() {
        return (
            <Button onPress={()=>{}} style={DashboardItem.styles.dashboardItemButton}
                    bordered large info>
                <View style={DashboardItem.styles.innerButton}>
                    <Text style={DashboardItem.styles.buttonText}>
                        {this.props.name}
                    </Text>
                </View>
            </Button>);
    }
}


export default DashboardItem;