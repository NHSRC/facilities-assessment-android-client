import {Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import Path, {PathRoot} from "../../framework/routing/Path";
import {Button, Container, Content, Footer, Header, Icon, Title} from "native-base";
import Typography from "../styles/Typography";
import FlatUITheme from "../themes/flatUI";
import SeedProgressService from "../../service/SeedProgressService";
import StateService from "../../service/StateService";
import SeedProgress from "../../models/SeedProgress";
import TypedTransition from "../../framework/routing/TypedTransition";
import ModeSelection from "../modes/ModeSelection";
import Logger from "../../framework/Logger";
import LocalReferenceDataSyncService from "../../service/LocalReferenceDataSyncService";
import PackagedJSON from "../../service/PackagedJSON";

const nhsrcbanner = require('../img/nhsrcbanner.png');

@PathRoot
@Path('/StateSelection')
class StateSelection extends AbstractComponent {
    static propTypes = {};

    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        }
    });

    componentWillMount() {
        let seedProgress = this.context.getService(SeedProgressService).getSeedProgress();
        if (seedProgress.loadState === SeedProgress.AppLoadState.LoadedState) {
            TypedTransition.from(this).resetTo(ModeSelection);
        } else {
            let states = this.context.getService(StateService).getAllStates();
            this.setState({state: {}, states: states});
        }
    }

    stateSelected() {
        let localReferenceDataSyncService = this.context.getService(LocalReferenceDataSyncService);
        localReferenceDataSyncService.syncMetaDataSpecificToStateFromLocal(() => {
            this.context.getService(SeedProgressService).finishedLoadStateSpecificData();
            this.context.getService(StateService).deleteStatesExcept(this.state.state);
            TypedTransition.from(this).resetTo(ModeSelection);
        }, this.state.state);
    }

    toggleState(state) {
        if (state.name === this.state.state.name) this.setState({state: {}, dataSource: this.state.states});
        else this.setState({state: state, dataSource: this.state.states});
    }

    render() {
        if (_.isNil(this.state)) return <View/>;
        Logger.logDebugObject('StateSelection', this.state.state);
        return (
            <Container theme={FlatUITheme}>
                <Header style={StateSelection.styles.header}>
                    <Title style={[Typography.paperFontHeadline, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>GUNAK गुणक</Title>
                </Header>
                <Content>
                    <View style={{flexDirection: 'column', margin: 8, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={[Typography.paperFontTitle, {color: "white"}]}>Select the state of your health facility</Text>
                        {this.state.states.map((state) =>
                            <TouchableHighlight key={state.name} onPress={() => this.toggleState(state)}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: "white"}}>{state.name}</Text>
                                    {this.state.state.name === state.name ? <Icon name='star' style={{fontSize: 20, color: "white"}} size={100}/> : <View/>}
                                </View>
                            </TouchableHighlight>)}
                        <Button
                            onPress={() => this.stateSelected()}
                            style={{backgroundColor: '#ffa000'}}
                            block
                            disabled={_.isNil(this.state.state.name)}>Save</Button>
                    </View>
                </Content>
                <Footer style={{backgroundColor: 'transparent'}}>
                    <Image resizeMode="contain"
                           style={{
                               width: Dimensions.get('window').width,
                           }}
                           source={nhsrcbanner}/>
                </Footer>
            </Container>
        );
    }
}

export default StateSelection;