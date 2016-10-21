import React, {Component} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import Path from "../../framework/routing/Path";
import AbstractComponent from "../common/AbstractComponent";
import {Container, Header, Title, Content} from "native-base";
import {Grid} from "react-native-easy-grid";
import PrimaryColors from "../styles/PrimaryColors";
import FlatUITheme from "../themes/flatUI";
import PickerHeader from "./PickerHeader";
import Actions from "../../action";

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
            department: this.props.params.selectedDepartment,
            departments: this.props.params.departments
        });
    }

    render() {
        return (
            <Container theme={FlatUITheme} style={Assessment.styles.assessmentContainer}>
                <Header>
                    <Title>Facilities Assessment</Title>
                </Header>
                <Content>
                    <Grid>
                        <PickerHeader data={this.state}/>
                    </Grid>
                </Content>
            </Container>

        );
    }
}

export default Assessment;