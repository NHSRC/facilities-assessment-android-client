import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import Path from "../../framework/routing/Path";
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content, Icon, Button, List, ListItem} from "native-base";
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

    renderAreaOfConcern(aoc) {
        return ()=>this.dispatchAction(Actions.EXPAND_AREA_OF_CONCERN, {expandAoc: aoc})
    }

    render() {
        const areasOfConcern = this.state.checklist.areasOfConcern.map((aoc, idx)=>
            <ListItem key={idx} itemDivider button iconLeft onPress={this.renderAreaOfConcern(aoc)}>
                <Icon name={aoc.visible ? "expand-less" : "expand-more"} style={{fontSize: 40}}/>
                <Text style={{fontSize: 25}}>{`${aoc.reference}: ${aoc.name}`}</Text>
            </ListItem>);
        return (
            <Container theme={FlatUITheme} style={Assessment.styles.assessmentContainer}>
                <Header>
                    <Button transparent onPress={()=>TypedTransition.from(this).goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                    <Title>{this.state.checklist.name}</Title>
                </Header>
                <Content>
                    <List>
                        {areasOfConcern}
                    </List>
                </Content>
            </Container>

        );
    }
}

export default Assessment;