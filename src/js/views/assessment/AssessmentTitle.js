import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Typography from '../styles/Typography';
import {formatDateHuman} from "../../utility/DateUtils";
import PropTypes from 'prop-types';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class AssessmentTitle extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        facilityName: PropTypes.string.isRequired,
        assessmentToolName: PropTypes.string.isRequired,
        assessmentStartDate: PropTypes.object.isRequired
    };

    static styles = StyleSheet.create({
        subHeader: {
            color: "white",
            marginTop: deviceHeight * 0.0125
        },
        caption: {
            color: "rgba(255,255,255,0.7)"
        },
    });

    render() {
        return <View>
            <Text style={[Typography.paperFontHeadline, AssessmentTitle.styles.subHeader]}>
                {this.props.facilityName}
            </Text>
            <Text style={[Typography.paperFontCaption, AssessmentTitle.styles.caption]}>
                {this.props.assessmentToolName}
            </Text>
            <Text style={[Typography.paperFontCaption, AssessmentTitle.styles.caption]}>
                {`Assessment Start Date - ${formatDateHuman(this.props.assessmentStartDate)}`}
            </Text>
        </View>;
    }
}

export default AssessmentTitle;