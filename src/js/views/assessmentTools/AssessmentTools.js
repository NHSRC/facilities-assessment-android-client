import React, {Component} from "react";
import {View, StyleSheet, Text} from "react-native";
import {Icon as NIcon, Container, Content, Button} from "native-base";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AbstractComponent from "../../framework/view/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import TypedTransition from "../../framework/routing/TypedTransition";
import FacilitySelection from "../facilitySelection/FacilitySelection";
import Path, {PathRoot} from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import FlatUITheme from "../themes/flatUI";

@PathRoot
@Path("/assessmentTools")
class AssessmentTools extends AbstractComponent {

    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        assessmentToolsContainer: {
            flex: 10,
            backgroundColor: PrimaryColors.background,
            alignItems: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        },
        padding: {
            flex: 1,
        },
        appHero: {
            flex: 2,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        assessmentChoice: {
            flex: 3,
        },
        assessmentContent: {
            flex: 3,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        assessmentButton: {
            backgroundColor: PrimaryColors.textBold,
            width: 200,
        }
    });

    chooseAssessmentTool(assessmentToolName) {
        return () => TypedTransition.from(this).with({assessmentToolName: assessmentToolName}).to(FacilitySelection);
    }

    render() {
        return (
            <View style={AssessmentTools.styles.assessmentToolsContainer}>
                <View style={AssessmentTools.styles.padding}/>
                <View style={AssessmentTools.styles.appHero}>
                    <Icon name="assessment" size={45} color={PrimaryColors.textBold}/>
                    <Text style={[Typography.paperFontDisplay1, {color: PrimaryColors.textBold}]}>
                        Facilities Assessment</Text>
                </View>
                <Container style={AssessmentTools.styles.assessmentChoice}>
                    <Content theme={FlatUITheme}>
                        <View style={AssessmentTools.styles.assessmentContent}>
                            <Button primary
                                    large
                                    onPress={this.chooseAssessmentTool("SQAS").bind(this)}
                                    style={AssessmentTools.styles.assessmentButton}>
                                <NIcon name={"assignment"}/>
                                SQAS
                            </Button>
                            <Button primary
                                    onPress={this.chooseAssessmentTool("Kayakalp").bind(this)}
                                    large
                                    style={AssessmentTools.styles.assessmentButton}>
                                <NIcon name={"spa"}/>
                                Kayakalp
                            </Button>
                        </View>
                    </Content>
                </Container>
                <View style={AssessmentTools.styles.padding}/>
            </View>);
    }
}

export default AssessmentTools;