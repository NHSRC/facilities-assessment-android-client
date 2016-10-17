import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Path from '../../framework/routing/Path';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Tabs, Footer, FooterTab, Button} from 'native-base';
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import AssessmentMode from './AssessmentMode';
import ScoreMode from './ScoreMode';

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
                    <Title>Facilities Assessment</Title>
                </Header>
                <Content>
                    <Tabs>
                        <AssessmentMode facilityName={this.props.params.selectedFacility} tabLabel="Assessment"/>
                        <ScoreMode tabLabel="Scores"/>
                    </Tabs>

                </Content>
            </Container>
        );
    }
}

export default ModeSelection;