import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import {Text, Button, Icon} from 'native-base';
import Typography from '../../styles/Typography';
import PrimaryColors from "../../styles/PrimaryColors";
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

class AssessmentTools extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        subheader: {
            color: "white",
        },
        inactiveButton: {
            width: deviceWidth * 0.44,
            paddingTop: 16,
            paddingBottom: 16,
            marginTop: deviceheight * 0.02667,
            flexDirection: "row",
            justifyContent: 'flex-start',
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            elevation: 0,
            shadowOffset: {width: 0, height: 0},
        },
        activeButton: {
            width: deviceWidth * 0.44,
            paddingTop: 16,
            paddingBottom: 16,
            marginTop: deviceheight * 0.02667,
            backgroundColor: PrimaryColors.blue,
            flexDirection: "row",
            justifyContent: 'flex-start',
            elevation: 0,
            shadowOffset: {width: 0, height: 0},
        },
        buttonsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
        }
    });

    onSelect(assessmentTool) {
        return () =>
            this.dispatchAction(Actions.SELECT_ASSESSMENT_TOOL, {selectedAssessmentTool: assessmentTool});
    }

    render() {
        const selectedAssessmentTool = this.props.data.selectedAssessmentTool;
        const assessmentTools = this.props.data.assessmentTools.map((assessmentTool, idx) => {
                const isSelected =
                    _.isEmpty(selectedAssessmentTool) ? false : selectedAssessmentTool.uuid === assessmentTool.uuid;
                return (
                    <Button
                        light={!isSelected}
                        dark={isSelected}
                        key={idx}
                        style={isSelected ? AssessmentTools.styles.activeButton : AssessmentTools.styles.inactiveButton}
                        iconLeft={true}
                        onPress={this.onSelect(assessmentTool)}>
                        <Icon style={{color: isSelected ? "white" : PrimaryColors.subheader_black}}
                              name='list-box'/><Text>{assessmentTool.name}</Text>
                    </Button>)
            }
        );
        return (
            <View style={{flex: 1}}>
                <Text style={[Typography.paperFontSubhead, AssessmentTools.styles.subheader]}>
                    Select An Assessment Tool
                </Text>
                <View style={AssessmentTools.styles.buttonsContainer}>
                    {assessmentTools}
                </View>
            </View>
        );
    }
}

export default AssessmentTools;