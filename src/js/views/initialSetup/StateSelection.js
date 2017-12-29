import {ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
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
        setTimeout(() => {
            let localReferenceDataSyncService = this.context.getService(LocalReferenceDataSyncService);
            localReferenceDataSyncService.syncMetaDataSpecificToStateFromLocal(() => {
                this.context.getService(SeedProgressService).finishedLoadStateSpecificData();
                this.context.getService(StateService).deleteStatesExcept(this.state.state);
                TypedTransition.from(this).resetTo(ModeSelection);
            }, this.state.state);
        }, 100);
        this.setState({state: this.state.state, states: this.state.states, busy: true});
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
                        <Text style={[Typography.paperFontTitle, {color: "white", marginBottom: 20}]}>Select the state of your health facility</Text>
                        <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                        {this.state.states.map((state) =>
                            <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableHighlight key={state.name} onPress={() => this.toggleState(state)}>
                                    <View style={{flexDirection: 'row', height: 30}}>
                                        <Text style={{color: "white"}}>{state.name}</Text>
                                        {this.state.state.name === state.name ? <Icon name='done' style={{fontSize: 20, color: "white", marginLeft: 10}} size={100}/> :
                                            <View/>}
                                    </View>
                                </TouchableHighlight>
                                <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                            </View>)}
                        <Button
                            onPress={() => this.stateSelected()}
                            style={{backgroundColor: '#ffa000', marginTop: 20}}
                            block
                            disabled={_.isNil(this.state.state.name)}>{this.state.busy ?
                            (<ActivityIndicator animating={true} size={"large"} color="white"
                                                style={{height: 80}}/>) :
                            "SAVE"}
                        </Button>
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