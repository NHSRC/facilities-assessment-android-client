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
import QuestionAnswer from './QuestionAnswer';
import Pagination from './Pagination';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/assessment")
class Assessment extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().checklistAssessment;
        this.unsubscribe = store.subscribeTo('assessment', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().assessment;
        this.setState(newState);
    }

    componentWillMount() {
        this.dispatchAction(Actions.GET_CHECKPOINTS, {...this.props.params});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    render() {
        const currentCheckpoint = this.state.checkpoints[0];
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
                        <QuestionAnswer checkpoint={currentCheckpoint}/>
                        <Pagination currentCheckpoint={currentCheckpoint} checkpoints={this.state.checkpoints}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Assessment;