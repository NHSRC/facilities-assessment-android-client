import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, Radio} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import _ from 'lodash';


class Compliance extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.complianceMap = {
            "Non Compliant": 0,
            "Partially Compliant": 1,
            "Fully Compliant": 2
        }
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

    selectCompliance(compliance) {
        return ()=> {
            this.dispatchAction(Actions.SELECT_COMPLIANCE, {
                checkpoint: this.props.data,
                compliance: this.complianceMap[compliance]
            })
        }
    }

    render() {
        const selectedCompliance = _.findKey(this.complianceMap, (v)=>v === this.props.assessment.score);
        const complianceButtons = Object.keys(this.complianceMap).map((compliance, idx)=>
            <View key={idx} style={Compliance.styles.button}>
                <Radio style={{alignSelf: 'center'}} selected={compliance === selectedCompliance}
                       onPress={this.selectCompliance(compliance)}/>
                <Text style={Compliance.styles.text}>{compliance}</Text>
            </View>
        );
        return (
            <ListItem style={Compliance.styles.complianceBody}>
                <View style={Compliance.styles.button}>
                    <Text style={Compliance.styles.title}>Compliance</Text>
                </View>
                {complianceButtons}
            </ListItem>
        );
    }
}

export default Compliance;