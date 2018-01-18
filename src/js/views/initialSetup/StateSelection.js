import {ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import Path, {PathRoot} from "../../framework/routing/Path";
import {Button, Container, Content, Footer, Header, Icon, Title} from "native-base";
import Typography from "../styles/Typography";
import FlatUITheme from "../themes/flatUI";
import SeedProgressService from "../../service/SeedProgressService";
import StateService from "../../service/StateService";
import TypedTransition from "../../framework/routing/TypedTransition";
import ModeSelection from "../modes/ModeSelection";
import Logger from "../../framework/Logger";
import LocalReferenceDataSyncService from "../../service/LocalReferenceDataSyncService";
import EnvironmentConfig from "../common/EnvironmentConfig";
import SettingsService from "../../service/SettingsService";
import _ from 'lodash';
import Actions from "../../action";

const nhsrcbanner = require('../img/nhsrcbanner.png');

@PathRoot
@Path('/StateSelection')
class StateSelection extends AbstractComponent {
    static propTypes = {
        chooseAdditional: React.PropTypes.bool
    };

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

    get doChooseAdditionalState() {
        return _.isNil(this.props.params) ? false : this.props.params.chooseAdditional;
    }

    componentWillMount() {
        if (EnvironmentConfig.shouldUsePackagedSeedData) {
            let settings = this.context.getService(SettingsService).get();
            let seedProgress = this.context.getService(SeedProgressService).getSeedProgress();
            let noStateLoaded = settings.numberOfStates === 0;
            if (noStateLoaded || this.doChooseAdditionalState) {
                let states = settings.removeStatesAlreadySetup(this.context.getService(StateService).getAllStates());
                this.setState(new StateSelectionState(null, states));
            } else {
                TypedTransition.from(this).to(ModeSelection);
            }
        } else {
            TypedTransition.from(this).to(ModeSelection);
        }
    }

    stateSelected() {
        setTimeout(() => {
            let localReferenceDataSyncService = this.context.getService(LocalReferenceDataSyncService);
            localReferenceDataSyncService.syncMetaDataSpecificToStateFromLocal(() => {
                this.context.getService(SeedProgressService).finishedLoadStateSpecificData();
                this.context.getService(SettingsService).addState(this.state.selectedState);
                this.dispatchAction(Actions.MODE_SELECTION);
                TypedTransition.from(this).goBack();
            }, this.state.selectedState);
        }, 100);
        this.setState(StateSelectionState.countryStateSelected(this.state));
    }

    toggleState(countryState) {
        this.setState(StateSelectionState.toggleState(this.state, countryState));
    }

    render() {
        Logger.logDebug('StateSelection', 'renderEmpty');
        if (_.isNil(this.state)) return <View/>;

        Logger.logDebug('StateSelection', 'render');
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
                        {this.state.allStates.map((countryState) =>
                            <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}} key={countryState.name}>
                                <TouchableHighlight key={countryState.name} onPress={() => this.toggleState(countryState)}>
                                    <View style={{flexDirection: 'row', height: 32}}>
                                        <Text style={{color: "white"}}>{countryState.name}</Text>
                                        {StateSelectionState.isSelectedState(this.state, countryState) ? <Icon name='done' style={{fontSize: 20, color: "white", marginLeft: 10}} size={100}/> :
                                            <View/>}
                                    </View>
                                </TouchableHighlight>
                                <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                            </View>)}
                        <Button
                            onPress={() => this.stateSelected()}
                            style={{backgroundColor: '#ffa000', marginTop: 20}}
                            block
                            disabled={!StateSelectionState.anyStateSelected(this.state)}>{this.state.busy ?
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

class StateSelectionState {
    constructor(selectedState, allStates) {
        this.selectedState = selectedState;
        this.allStates = allStates;
    }

    static clone(stateSelectionState) {
        let newStateSelectionState = new StateSelectionState(stateSelectionState.selectedState, stateSelectionState.allStates);
        newStateSelectionState.isBusy = stateSelectionState.isBusy;
        return newStateSelectionState;
    }

    static countryStateSelected(stateSelectionState) {
        let newState = StateSelectionState.clone(stateSelectionState);
        newState.busy = true;
        return newState;
    }

    static toggleState(stateSelectionState, state) {
        let newState = StateSelectionState.clone(stateSelectionState);
        newState.selectedState = StateSelectionState.isSelectedState(stateSelectionState, state) ? null : state;
        return newState;
    }

    static isSelectedState(stateSelectionState, state) {
        return StateSelectionState.anyStateSelected(stateSelectionState) && stateSelectionState.selectedState.uuid === state.uuid;
    }

    static anyStateSelected(stateSelectionState) {
        return !_.isNil(stateSelectionState.selectedState);
    }
}

export default StateSelection;