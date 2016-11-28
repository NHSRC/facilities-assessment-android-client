import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import {ListItem, CheckBox} from "native-base";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from "../../action";


class AssessmentMethod extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.assessmentMethodMap = {
            "SI": "amStaffInterview",
            "PI": "amPatientInterview",
            "OB": "amObservation",
            "RR": "amRecordReview"
        };
        this.selectAssessmentMethod = this.selectAssessmentMethod.bind(this);
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

    selectAssessmentMethod(assessmentMethod) {
        return ()=> {
            this.props.assessment.assessmentMethods[this.assessmentMethodMap[assessmentMethod]] = true;
            this.dispatchAction(Actions.SELECT_ASSESSMENT_METHOD, {
                checkpoint: this.props.data,
                assessmentMethods: assessmentMethod
            })
        }
    }

    render() {
        const selectedAssessmentMethods = _.mapKeys(this.props.assessment.assessmentMethods,
            (v, k)=> _.findKey(this.assessmentMethodMap, (value)=>value === k));
        const assessmentMethods = Object.keys(this.assessmentMethodMap).map((am, idx)=>
            <View key={idx} style={AssessmentMethod.styles.button}>
                <CheckBox key={idx} onPress={this.selectAssessmentMethod(am)}
                          checked={selectedAssessmentMethods[am]}/>
                <Text style={AssessmentMethod.styles.text}>{am}</Text>
            </View>
        );
        return (
            <ListItem style={AssessmentMethod.styles.body}>
                <View style={AssessmentMethod.styles.button}>
                    <Text style={AssessmentMethod.styles.text}>Assessment Method</Text>
                </View>
                {assessmentMethods}
            </ListItem>
        );
    }
}

export default AssessmentMethod;