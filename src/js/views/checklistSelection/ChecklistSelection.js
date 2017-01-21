import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import Actions from "../../action";
import TypedTransition from "../../framework/routing/TypedTransition";
import Assessment from '../assessment/Assessment';
import FlatUITheme from '../themes/flatUI';
import Path from "../../framework/routing/Path";
import AssessmentStatus from './AssessmentStatus';
import Checklists from './Checklists';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/checklistSelection")
class ChecklistSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().checklistSelection;
        this.unsubscribe = store.subscribeTo('checklistSelection', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        subheader: {
            color: PrimaryColors.subheader_black,
            marginTop: deviceHeight * 0.0125
        },
        caption: {
            color: PrimaryColors.caption_black
        },
    });

    handleChange() {
        const newState = this.context.getStore().getState().checklistSelection;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_CHECKLISTS, {
            assessmentTool: this.props.params.selectedAssessmentTool,
            facilityAssessment: this.props.params.facilityAssessment
        });
    }

    handleOnPress(checklist) {
        return () => TypedTransition.from(this).with({
            selectedChecklist: checklist,
            facility: this.props.params.selectedFacility,
            assessmentType: this.props.params.selectedAssessmentType,
            facilityAssessment: this.props.params.facilityAssessment
        }).to(Assessment);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const completedChecklistsCount = this.state.checklists.filter((checklist) => checklist.progress.status === 1).length;
        return (
            <Container theme={FlatUITheme}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>Assessment</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Text style={[Typography.paperFontHeadline, ChecklistSelection.styles.subheader]}>
                            {this.props.params.selectedFacility.name}
                        </Text>
                        <Text style={[Typography.paperFontCaption, ChecklistSelection.styles.caption]}>
                            {this.props.params.selectedAssessmentTool.name}
                        </Text>
                        <AssessmentStatus
                            total={this.state.checklists.length}
                            completed={completedChecklistsCount}/>
                        <Checklists
                            handleOnPress={this.handleOnPress.bind(this)}
                            total={this.state.checklists.length}
                            completed={completedChecklistsCount}
                            allChecklists={this.state.checklists}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistSelection;