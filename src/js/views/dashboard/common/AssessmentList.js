import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Typography from '../../styles/Typography';
import PrimaryColors from '../../styles/PrimaryColors';
import _ from 'lodash';
import {Text, View} from 'native-base';

const deviceWidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

class AssessmentList extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        container: {
            marginTop: deviceheight * .025,
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            borderBottomWidth: 1,
            borderColor: PrimaryColors.dark_white
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
            borderColor: PrimaryColors.dark_white,
            height: deviceheight * .1106,
        },
        listItemText: {
            marginTop: 12
        },
        listItemButton: {
            alignSelf: 'center',
        },
        listItemButtonContainer: {
            marginTop: 5,
            borderRadius: 2,
            backgroundColor: PrimaryColors.blue,
            width: deviceWidth * .19,
            height: deviceheight * .0375,
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

    renderSpinner() {
        return (<ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/>);
    }

    renderButtonContent(buttonText) {
        return (
            <Text style={[Typography.paperFontCaption, {color: "white"}]}>
                {buttonText}
            </Text>);
    }

    renderAssessment(assessment, key) {
        const buttons = this.props.buttons
            .filter((button, key) => !_.isFunction(button.shouldRender) || button.shouldRender(assessment))
            .map((button, key) =>
                <View key={key} style={AssessmentList.styles.listItemButtonContainer}>
                    <TouchableOpacity onPress={button.onPress(assessment)}>
                        <View style={AssessmentList.styles.listItemButton}>
                            {assessment.syncing ? this.renderSpinner() : this.renderButtonContent(button.text)}
                        </View>
                    </TouchableOpacity>
                </View>);
        return (
            <View key={key} style={AssessmentList.styles.listItem}>
                <View style={AssessmentList.styles.listItemText}>
                    <Text style={[Typography.paperFontCaption, {color: "white"}]}>
                        {this.assessmentDisplayText(assessment)}
                    </Text>
                    <Text style={[Typography.paperFontCaption, {color: "rgba(255,255,255,0.7)", marginTop: 4}]}>
                        {assessment.facility.facilityType.name}
                    </Text>
                </View>
                <View style={{flexDirection: 'column'}}>
                    {buttons}
                </View>
            </View>);
    }

    assessmentDisplayText(assessment) {
        return _.isNil(assessment.seriesName) ? assessment.facility.name : `${assessment.seriesName} - ${assessment.facility.name}`;
    }

    render() {
        const Assessments = _.sortBy(this.props.assessments, (assessment) => assessment.seriesName).map(this.renderAssessment.bind(this));
        return (
            <View style={AssessmentList.styles.container}>
                <View style={AssessmentList.styles.header}>
                    <Text style={[Typography.paperFontBody1, {color: "white"}]}>
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