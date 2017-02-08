import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, TouchableWithoutFeedback} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from '../../../action';
import Dashboard from '../Dashboard';
import Typography from '../../styles/Typography';
import PrimaryColors from '../../styles/PrimaryColors';


const deviceWidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

class AssessmentList extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            borderBottomWidth: 1,
            borderColor: PrimaryColors.light_black
        },
        header: {
            alignSelf: 'flex-start',
        },
        list: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
        },
        listItem: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: PrimaryColors.light_black,
            height: deviceheight * .1106,
        },
        listItemText: {
            marginTop: 12
        },
        listItemButton: {
            alignSelf: 'center',
        },
        listItemButtonContainer: {
            marginTop: 18,
            borderRadius: 2,
            backgroundColor: PrimaryColors.blue,
            width: deviceWidth * .175,
            height: deviceheight * .0375,
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

    render() {
        const Assessments = this.props.assessments.map((assessment, key) =>
            <View key={key} style={AssessmentList.styles.listItem}>
                <View style={AssessmentList.styles.listItemText}>
                    <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.subheader_black}]}>
                        {assessment.facility.name}
                    </Text>
                    <Text style={[Typography.paperFontCaption, {color: PrimaryColors.caption_black, marginTop: 4}]}>
                        {assessment.facility.facilityType.name}
                    </Text>
                </View>
                <View style={AssessmentList.styles.listItemButtonContainer}>
                    <TouchableWithoutFeedback onPress={this.props.handlePress(assessment)}>
                        <View style={AssessmentList.styles.listItemButton}>
                            <Text style={[Typography.paperFontBody1, {color: "white"}]}>
                                {this.props.buttonText}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>);
        return (
            <View style={AssessmentList.styles.container}>
                <View style={AssessmentList.styles.header}>
                    <Text style={[Typography.paperFontBody1, {color: PrimaryColors.subheader_black}]}>
                        {this.props.header}
                    </Text>
                </View>
                <View style={AssessmentList.styles.list}>
                    {Assessments}
                </View>
            </View>
        );
    }
}

export default AssessmentList;