import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button, Container, Content, Header, Icon, Title} from 'native-base';
import ViewComponent from "../common/ViewComponent";
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import Actions from '../../action';
import QuestionAnswer from './QuestionAnswer';
import Pagination from './Pagination';
import _ from 'lodash';
import GestureRecognizer from 'react-native-swipe-gestures';
import Standard from "../../models/Standard";
import Logger from "../../framework/Logger";
import GunakContainer from "../common/GunakContainer";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

@Path("/assessment")
class Assessment extends ViewComponent {
    constructor(props, context) {
        super(props, context, 'assessment');
    }

    static styles = StyleSheet.create({});

    componentWillMount() {
        this.dispatchAction(Actions.GET_CHECKPOINTS, {...this.props.params});
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
        Logger.logDebug('Assessment', 'render');
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 80
        };
        return (
            <GunakContainer title={`${this.state.standard.reference} - ${Standard.getDisplayName(this.state.standard)}`  } scrollToTop={this.state.pageChanged}>
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
            </GunakContainer>
        );
    }
}

export default Assessment;