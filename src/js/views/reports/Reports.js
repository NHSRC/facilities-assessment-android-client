import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";

const deviceWidth = Dimensions.get('window').width;

@Path("/reports")
class Reports extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        // this.state = store.getState().reports;
        // this.unsubscribe = this.unsubscribe = store.subscribeTo('reports', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({
        container: {
            margin: deviceWidth * 0.04,
        }
    });

    componentWillUnmount() {
        // this.unsubscribe();
    }

    render() {
        return (
            <Container theme={FlatUITheme}>
                <Content>
                    <Header>
                        <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                            <Icon style={{marginTop: 10}} name='arrow-back'/>
                        </Button>
                        <Title style={[Typography.paperFontHeadline,
                            {fontWeight: 'bold', color: PrimaryColors.subheader_black}]}>
                            Reports
                        </Title>
                    </Header>

                </Content>
            </Container>
        );
    }
}

export default Reports;