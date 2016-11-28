import React, {Component} from "react";
import {View, StyleSheet, Text} from "react-native";
import {Icon as NIcon, Container, Content, Button, ListItem, List} from "native-base";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AbstractComponent from "../../framework/view/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import TypedTransition from "../../framework/routing/TypedTransition";
import FacilitySelection from "../facilitySelection/FacilitySelection";
import Path, {PathRoot} from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import FlatUITheme from "../themes/flatUI";
import Actions from '../../action';

@PathRoot
@Path("/assessmentTools")
class AssessmentTools extends AbstractComponent {

    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().assessmentTools;
        this.unsubscribe = store.subscribeTo('assessmentTools', this.handleChange.bind(this));
    }

    handleChange() {
        const newState = this.context.getStore().getState().assessmentTools;
        this.setState(newState);
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
            flex: 2,
        },
        assessmentButton: {
            backgroundColor: PrimaryColors.textBold,
        }
    });

    chooseAssessmentTool(assessmentTool) {
        return () => TypedTransition.from(this).with({assessmentTool: assessmentTool}).to(FacilitySelection);
    }

    componentDidMount() {
        this.dispatchAction(Actions.ALL_ASSESSMENT_TOOLS);
    }

    render() {
        const assessmentTools = this.state.assessmentTools.map((assessmentTool, idx)=>
            <ListItem style={AssessmentTools.styles.assessmentButton} iconLeft key={idx}
                      onPress={this.chooseAssessmentTool(assessmentTool).bind(this)}>
                <NIcon style={{color: PrimaryColors.background}} name={"assignment"}/>
                <Text style={{
                    color: PrimaryColors.background,
                    fontSize: 20,
                }}>{assessmentTool.name}</Text>
            </ListItem>);
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
                        <Text style={{color: PrimaryColors.textBold, fontSize: 30, alignSelf: 'center'}}>Choose an
                            Assessment Tool</Text>
                        <List style={{marginRight: 11}}>
                            {assessmentTools}
                        </List>
                    </Content>
                </Container>
            </View>);
    }
}

export default AssessmentTools;