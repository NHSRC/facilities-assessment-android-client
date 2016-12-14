import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView, ProgressBarAndroid as ProgressBar} from "react-native";
import Path from "../../framework/routing/Path";
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from "native-base";
import AreasOfConcern from './AreasOfConcern';
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from "../themes/flatUIAssessment";
import Actions from "../../action";
import SubmitButton from '../common/SubmitButton';
import TypedTransition from "../../framework/routing/TypedTransition";

@Path("/assessment")
class Assessment extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().assessment;
        store.subscribeTo('assessment', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        assessmentContainer: {
            backgroundColor: PrimaryColors.background
        },
        textColor: {
            color: PrimaryColors.textBold
        }
    });

    handleChange() {
        const newState = this.context.getStore().getState().assessment;
        this.setState(newState);
    }

    componentDidMount() {
        this.dispatchAction(Actions.START_ASSESSMENT, {
            checklist: this.props.params.selectedChecklist,
            assessmentType: this.props.params.assessmentType,
            facility: this.props.params.facility
        });
    }

    render() {
        const progressRatio = this.state.progress.completed / this.state.progress.total;
        const submitButton = progressRatio < .9 ? (<View/>) : (<SubmitButton
            onPress={()=> this.dispatchAction(Actions.SUBMIT_ASSESSMENT,
                {cb: ()=>TypedTransition.from(this).goBack()})}
            buttonText={"Submit Assessment"} buttonIcon={"done"}/>);
        return (
            <Container theme={FlatUITheme} style={Assessment.styles.assessmentContainer}>
                <Header>
                    <Button transparent onPress={()=>TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>{this.state.checklist.name}</Title>
                </Header>
                <View style={{flex: 1}}>
                    <View style={{backgroundColor: PrimaryColors.textBold}}>
                        <Text style={{alignSelf: 'center', fontSize: 21, color: PrimaryColors.background}}>Checklist
                            Status</Text>
                        <Text style={{alignSelf: 'center', fontSize: 18, color: PrimaryColors.background}}>Checkpoints
                            Completed: {this.state.progress.completed}/{this.state.progress.total}</Text>
                        <ProgressBar style={{marginBottom: 10}}
                                     color={progressRatio < .9 ? PrimaryColors.red : PrimaryColors.background}
                                     styleAttr="Horizontal" indeterminate={false}
                                     progress={progressRatio}/>
                    </View>
                    <ScrollView>
                        <AreasOfConcern
                            assessment={this.state.assessment}
                            areasOfConcern={this.state.checklist.areasOfConcern}/>
                    </ScrollView>
                    {submitButton}
                </View>
            </Container>

        );
    }
}

export default Assessment;