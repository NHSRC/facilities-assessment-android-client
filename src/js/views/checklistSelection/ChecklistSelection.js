import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import Actions from "../../action";
import TypedTransition from "../../framework/routing/TypedTransition";
import FlatUITheme from '../themes/flatUI';
import Path from "../../framework/routing/Path";
import AssessmentStatus from './AssessmentStatus';
import Checklists from './Checklists';
import AreasOfConcern from "../areasOfConcern/AreasOfConcern";
import SubmitButton from '../common/SubmitButton';


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
        this.dispatchAction(Actions.ALL_CHECKLISTS, {...this.props.params});
    }

    handleOnPress(checklist) {
        return () => TypedTransition.from(this).with({
            checklist: checklist,
            ...this.props.params
        }).to(AreasOfConcern);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    completeAssessment() {
        this.dispatchAction(Actions.COMPLETE_ASSESSMENT, {
            cb: () => TypedTransition.from(this).goBack(),
            ...this.props.params
        });
        this.dispatchAction(Actions.ALL_ASSESSMENTS);
    }

    render() {
        let assessmentComplete = this.state.assessmentProgress.completed === this.state.assessmentProgress.total;
        return (
            <Container theme={FlatUITheme}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 10}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline,
                        {fontWeight: 'bold', color: PrimaryColors.subheader_black}]}>
                        Assessment
                    </Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <Text style={[Typography.paperFontHeadline, ChecklistSelection.styles.subheader]}>
                            {this.props.params.facility.name}
                        </Text>
                        <Text style={[Typography.paperFontCaption, ChecklistSelection.styles.caption]}>
                            {this.props.params.assessmentTool.name}
                        </Text>
                        <AssessmentStatus
                            assessmentProgress={this.state.assessmentProgress}/>
                        <Checklists
                            handleOnPress={this.handleOnPress.bind(this)}
                            assessmentProgress={this.state.assessmentProgress}
                            allChecklists={this.state.checklists}
                        />
                        <SubmitButton buttonStyle={{marginTop: 30}}
                                      onPress={this.completeAssessment.bind(this)}
                                      buttonText="COMPLETE ASSESSMENT"
                                      showButton={assessmentComplete}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistSelection;