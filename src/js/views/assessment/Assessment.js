import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Content, Title, Button, Header, Icon} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import PrimaryColors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import Actions from '../../action';
import ListingItem from '../common/ListingItem';
import QuestionAnswer from './QuestionAnswer';
import Pagination from './Pagination';
import _ from 'lodash';
import Dashboard from '../dashboard/Dashboard';
import GestureRecognizer from 'react-native-swipe-gestures';


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

    getCurrentIndex() {
        return _.findIndex(this.state.checkpoints,
            (checkpoint) => this.state.currentCheckpoint.uuid === checkpoint.uuid);
    }

    onNext() {
        let nextIndex = this.getCurrentIndex() + 1;
        const nextCheckpoint = this.state.checkpoints[nextIndex >= this.state.checkpoints.length ? nextIndex - 1 : nextIndex];
        this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: nextCheckpoint});
    }

    onPrev() {
        let prevIndex = this.getCurrentIndex() - 1;
        const prevCheckpoint = this.state.checkpoints[prevIndex < 0 ? 0 : prevIndex];
        this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: prevCheckpoint});
    }


    render() {
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 80
        };
        return (
            <Container theme={FlatUITheme}>
                <Header style={Dashboard.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 10, color: "white"}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontHeadline,
                        {fontWeight: 'bold', color: "white"}]}>
                        {`${this.state.standard.reference} - ${_.truncate(this.state.standard.name, {length: 25})}`}
                    </Title>
                </Header>
                <Content>
                    <GestureRecognizer
                        onSwipeLeft={this.onNext.bind(this)}
                        onSwipeRight={this.onPrev.bind(this)}
                        config={config}
                        style={{flex: 1,}}>
                        <View style={{margin: deviceWidth * 0.04,}}>
                            <QuestionAnswer goBack={() => TypedTransition.from(this).goBack()}
                                            checkpoints={this.state.checkpoints}
                                            currentCheckpoint={this.state.currentCheckpoint}
                                            {...this.props}/>
                            <Pagination currentCheckpoint={this.state.currentCheckpoint}
                                        checkpoints={this.state.checkpoints}/>
                        </View>
                    </GestureRecognizer>
                </Content>
            </Container>
        );
    }
}

export default Assessment;