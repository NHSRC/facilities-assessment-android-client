import {Alert, ActivityIndicator, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import Path, {PathRoot} from "../../framework/routing/Path";
import {Button, Container, Content, Header, Icon, Title, Left, Body, StyleProvider} from "native-base";
import Typography from "../styles/Typography";
import TypedTransition from "../../framework/routing/TypedTransition";
import ModeSelection from "../modes/ModeSelection";
import Logger from "../../framework/Logger";
import _ from 'lodash';
import Actions from "../../action";
import SeedProgressService from "../../service/SeedProgressService";
import StateSelectionUserState from "../../action/userState/StateSelectionUserState";
import getTheme from '../../../../native-base-theme/components';
import platformTheme from '../../../../native-base-theme/variables/platform';

@PathRoot
@Path('/StateSelection')
class StateSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'stateSelection');
    }

    static styles = StyleSheet.create({});

    componentWillMount() {
        this.dispatchAction(Actions.STATE_SELECTION_LOADED, {params: this.props.params});
    }

    stateSelectionConfirmed() {
        let timeoutID = setTimeout(() => {
            this.dispatchAction(Actions.STATE_SELECTION_CONFIRMED, {
                onError: (error) => {
                    Alert.alert("Download failed", error.message,
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    clearTimeout(timeoutID);
                                    this.dispatchAction(Actions.STATE_DOWNLOAD_FAILED);
                                }
                            }
                        ],
                        {cancelable: false}
                    );
                }
            });
        }, 100);
        let intervalID = setInterval(() => {
            let seedProgress = this.getService(SeedProgressService).getSeedProgress();
            if (seedProgress.hasAllStatesLoaded()) {
                TypedTransition.from(this).resetTo(ModeSelection);
                clearInterval(intervalID);
            }
        }, 1000);
    }

    toggleState(countryState) {
        this.dispatchAction(Actions.TOGGLE_STATE, {countryState: countryState});
    }

    isItTheSelectedState(countryState) {
        return _.some(this.state.userState.selectedStates, (x) => x.uuid === countryState.uuid);
    };

    isAnyStateSelected() {
        return this.state.userState.selectedStates.length !== 0;
    };

    render() {
        if (_.isNil(this.state)) {
            Logger.logDebug('StateSelection', 'renderEmpty');
            return <View/>;
        } else if (!this.state.userState.displayStateSelection) {
            Logger.logDebug('StateSelection', 'Transitioning');
            this.dispatchAction(Actions.MODE_SELECTION);
            TypedTransition.from(this).resetTo(ModeSelection);
            return <View/>;
        }

        Logger.logDebug('StateSelection', 'render');
        Logger.logDebug('StateSelection', this.state.seedProgress);

        return (
            <StyleProvider style={getTheme(platformTheme)}>
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                                <Icon style={{marginTop: 5, color: "white"}} name='arrow-back'/>
                            </Button>
                        </Left>
                        <Body>
                            <Title style={[Typography.paperFontSubhead, {
                                color: 'white'
                            }]}>Select state of health facilities</Title>
                        </Body>
                    </Header>
                    <Content contentContainerStyle={{flexDirection: 'column', margin: 8, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                        {this.state.allStates.map((countryState) =>
                            <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}} key={countryState.name}>
                                <TouchableHighlight key={countryState.name} onPress={() => this.toggleState(countryState)}>
                                    <View style={{flexDirection: 'row', height: 32}}>
                                        <Text style={{color: "white"}}>{countryState.name}</Text>
                                        {this.isItTheSelectedState(countryState) ?
                                            <Icon name='done-all' style={{fontSize: 20, color: "white", marginLeft: 10}} size={100}/> :
                                            <View/>}
                                    </View>
                                </TouchableHighlight>
                                <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                            </View>)}
                        <Button
                            onPress={() => this.stateSelectionConfirmed()}
                            style={{backgroundColor: '#ffa000', marginTop: 20}}
                            block
                            disabled={!this.isAnyStateSelected()}>{this.state.userState.workflowState === StateSelectionUserState.WorkflowStates.StatesConfirmed ?
                            (<ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/>) : <Text>"SAVE"</Text>}
                        </Button>
                        {this.state.seedProgress.numberOfStates === 0 ? null : <Text
                            style={[Typography.paperFontSubhead, {
                                color: "white",
                                marginTop: 30
                            }]}>{`States already loaded - ${this.state.seedProgress.numberOfStates > 10 ? this.state.seedProgress.numberOfStates : this.state.loadedCountryStates}`}</Text>
                        }

                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}

export default StateSelection;