import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import Path from "../../framework/routing/Path";
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button} from "native-base";
import AreasOfConcern from './AreasOfConcern';
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from "../themes/flatUIAssessment";
import Actions from "../../action";
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
        this.dispatchAction(Actions.INITIAL_DATA, {
            checklist: this.props.params.selectedChecklist,
        });
    }

    render() {
        return (
            <Container theme={FlatUITheme} style={Assessment.styles.assessmentContainer}>
                <Header>
                    <Button transparent onPress={()=>TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>{this.state.checklist.name}</Title>
                </Header>
                <Content>
                    <AreasOfConcern areasOfConcern={this.state.checklist.areasOfConcern}/>
                </Content>
            </Container>

        );
    }
}

export default Assessment;