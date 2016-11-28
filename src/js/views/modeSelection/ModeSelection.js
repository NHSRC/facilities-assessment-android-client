import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path from '../../framework/routing/Path';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Tabs, Footer, FooterTab, Button} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from '../themes/flatUI';
import AssessmentMode from './AssessmentMode';
import ScoreMode from './ScoreMode';
import TypedTransition from "../../framework/routing/TypedTransition";

@Path("/modeSelection")
class ModeSelection extends AbstractComponent {
    static styles = StyleSheet.create({
        checklistContainer: {
            backgroundColor: PrimaryColors.background,
        },
    });

    render() {
        return (
            <Container theme={FlatUITheme} style={ModeSelection.styles.checklistContainer}>
                <Header>
                    <Button transparent onPress={()=>TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>Facilities Assessment</Title>
                </Header>
                <Content>
                    <Tabs>
                        <AssessmentMode facility={this.props.params.selectedFacility}
                                        assessmentTool={this.props.params.selectedAssessmentTool}
                                        assessmentType={this.props.params.selectedAssessmentType}
                                        tabLabel="Assessment"/>
                        <ScoreMode tabLabel="Scores" assessmentTool={this.props.params.selectedAssessmentTool}/>
                    </Tabs>

                </Content>
            </Container>
        );
    }
}

export default ModeSelection;