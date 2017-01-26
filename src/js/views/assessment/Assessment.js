import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from '../../action';
import ListingItem from '../common/ListingItem';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/checklistAssessment")
class ChecklistAssessment extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().checklistAssessment;
        this.unsubscribe = store.subscribeTo('checklistAssessment', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().checklistAssessment;
        this.setState(newState);
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    render() {
        return (
            <Container theme={FlatUITheme}>
                <Header>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 10}} name='arrow-back'/>
                    </Button>
                    <Title>{this.props.params.standard.name}</Title>
                </Header>
                <Content>
                    <View style={{margin: deviceWidth * 0.04,}}>
                        <ListingItem labelColor={PrimaryColors.yellow} item={this.props.params.standard}/>
                        <ListingItem labelColor={PrimaryColors.blue} item={this.props.params.standard}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChecklistAssessment;