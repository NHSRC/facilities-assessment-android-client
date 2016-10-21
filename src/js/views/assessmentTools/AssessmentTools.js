import React, {Component} from "react";
import {View} from "react-native";
import {Button, Icon} from "native-base";
import AbstractComponent from "../../framework/view/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import TypedTransition from "../../framework/routing/TypedTransition";
import FacilitySelection from "../facilitySelection/FacilitySelection";

class AssessmentTools extends AbstractComponent {
    static propTypes = {
        style: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (<View style={[this.props.style.assessmentTools, {flexDirection: "row", justifyContent: 'space-around', alignItems: 'flex-start'}]}>
                <Button large onPress={this.chooseAssessmentTool('SQAS')}>
                    <Icon name='ios-home' size={145} color={PrimaryColors.textBold}/>
                </Button>
                <Button large onPress={this.chooseAssessmentTool('Kayakalp')}>
                    <Icon name='ios-menu' size={145} color={PrimaryColors.textBold}/>
                </Button>
        </View>);
    }

    chooseAssessmentTool(assessmentToolName) {
        return () => TypedTransition.from(this).with({assessmentToolName: assessmentToolName}).to(FacilitySelection);
    }
}

export default AssessmentTools;