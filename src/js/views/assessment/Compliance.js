import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, Radio, List} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import _ from 'lodash';
import {Col, Row, Grid} from 'react-native-easy-grid';


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
            alignSelf: 'flex-start'
        },
        title: {
            color: PrimaryColors.textBold,
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
            <Col key={idx}>
                <Radio style={{alignSelf: 'flex-start'}} selected={compliance === selectedCompliance}
                       onPress={this.selectCompliance(compliance)}/>
                <Text style={Compliance.styles.text}>{compliance}</Text>
            </Col>
        );
        return (
            <List>
                <ListItem>
                    <Text style={Compliance.styles.title}>Compliance</Text>
                </ListItem>
                <ListItem>
                    <Grid>
                        {complianceButtons}
                    </Grid>
                </ListItem>
            </List>
        );
    }
}

export default Compliance;