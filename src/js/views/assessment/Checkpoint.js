import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {Card, CardItem, List, ListItem, Icon, Badge} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";
import Compliance from './Compliance';
import Remarks from './Remarks';
import {Col, Row, Grid} from 'react-native-easy-grid';
import _ from 'lodash';


class Checkpoint extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.assessmentMethodMap = {
            "amObservation": "OB",
            "amStaffInterview": "SI",
            "amPatientInterview": "PI",
            "amRecordReview": "RR"
        };
    }

    static styles = StyleSheet.create({
        question: {
            alignSelf: 'center',
            color: PrimaryColors.textBold,
            fontSize: 15
        },
    });

    render() {
        const checkpointAssessment = this.props.assessment.checkpoints[this.props.data.uuid] || {};
        var assessmentMethods = [];
        _.map(this.props.data, (value, key, idx)=> {
            if (value && _.startsWith(key, "am")) {
                assessmentMethods.push(<Badge key={Math.random()} warning>{this.assessmentMethodMap[key]}</Badge>);
            }
        });
        return (
            <CardItem style={{borderBottomWidth: 1, borderBottomColor: PrimaryColors.textBold, borderStyle: 'solid'}}
                      cardBody>
                <Grid>
                    <Col>
                        <List>
                            <ListItem>
                                <Text>{this.props.data.name}</Text>
                            </ListItem>
                            <ListItem>
                                <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                    {assessmentMethods}
                                </View>
                            </ListItem>
                        </List>
                    </Col>
                    <Col>
                        <Row>
                            <Compliance data={this.props.data} assessment={checkpointAssessment}/>
                        </Row>
                        <Row>
                            <Remarks data={this.props.data} assessment={checkpointAssessment}/>
                        </Row>
                    </Col>
                </Grid>
            </CardItem>
        );
    }
}

export default Checkpoint;