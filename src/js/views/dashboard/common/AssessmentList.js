import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
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
            marginTop: 18,
            borderRadius: 2,
            backgroundColor: PrimaryColors.blue,
            width: deviceWidth * .175,
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
            <Text style={[Typography.paperFontBody1, {color: "white"}]}>
                {buttonText}
            </Text>);
    }

    renderAssessment(assessment, key) {
        return (
            <View key={key} style={AssessmentList.styles.listItem}>
                <View style={AssessmentList.styles.listItemText}>
                    <Text style={[Typography.paperFontSubhead, {color: "white"}]}>
                        {assessment.facility.name}
                    </Text>
                    <Text style={[Typography.paperFontCaption, {color: "rgba(255,255,255,0.7)", marginTop: 4}]}>
                        {assessment.facility.facilityType.name}
                    </Text>
                </View>
                <View style={AssessmentList.styles.listItemButtonContainer}>
                    <TouchableWithoutFeedback onPress={this.props.handlePress(assessment)}>
                        <View style={AssessmentList.styles.listItemButton}>
                            {assessment.syncing ? this.renderSpinner() : this.renderButtonContent(this.props.buttonText)}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>);
    }

    render() {
        const Assessments = this.props.assessments.map(this.renderAssessment.bind(this));
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