import {ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import Path, {PathRoot} from "../../framework/routing/Path";
import {Button, Icon} from "native-base";
import Typography from "../styles/Typography";
import TypedTransition from "../../framework/routing/TypedTransition";
import ModeSelection from "../modes/ModeSelection";
import Logger from "../../framework/Logger";
import _ from 'lodash';
import Actions from "../../action";
import SeedProgressService from "../../service/SeedProgressService";
import StateSelectionUserState from "../../action/userState/StateSelectionUserState";
import GunakContainer from "../common/GunakContainer";
import PlatformIndependentProgressBar from "../progressBar/PlatformIndependentProgressBar";

const deviceWidth = Dimensions.get('window').width;

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
        let intervalID;
        let timeoutID = setTimeout(() => {
            this.dispatchAction(Actions.STATE_SELECTION_CONFIRMED, {
                onError: (error) => {
                    Alert.alert("Download failed", error.message,
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    clearTimeout(timeoutID);
                                    if (intervalID) clearInterval(intervalID);
                                    this.dispatchAction(Actions.STATE_DOWNLOAD_FAILED);
                                }
                            }
                        ],
                        {cancelable: false}
                    );
                }
            });
        }, 100);
        intervalID = setInterval(() => {
            let seedProgress = this.getService(SeedProgressService).getSeedProgress();
            this.dispatchAction(Actions.STATE_UPDATE_PROGRESS);
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

        let stateSelectionConfirmed = this.state.userState.workflowState === StateSelectionUserState.WorkflowStates.StatesConfirmed;
        return (
            <GunakContainer title="Select state of health facilities">
                <View>
                    <Text style={{height: 0.5, backgroundColor: "white", width: deviceWidth, marginTop: 5}}/>
                    {this.state.allStates.map((countryState) =>
                        <TouchableHighlight key={countryState.name} onPress={() => this.toggleState(countryState)}>
                            <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}}
                                  key={countryState.name}>
                                <View style={{flexDirection: 'row', height: 32}}>
                                    <Text style={{color: "white"}}>{countryState.name}</Text>
                                    {this.isItTheSelectedState(countryState) ?
                                        <Icon name='done-all' style={{fontSize: 20, color: "white", marginLeft: 10}}
                                              size={100}/> :
                                        <View/>}
                                </View>
                                <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                            </View>
                        </TouchableHighlight>
                    )}
                    {stateSelectionConfirmed ?
                        PlatformIndependentProgressBar.display(this.state.seedProgress.syncProgress, {marginTop: 20}) : null}
                    <Button
                        onPress={() => this.stateSelectionConfirmed()}
                        style={{backgroundColor: '#ffa000', marginTop: stateSelectionConfirmed ? 0 : 5}}
                        block
                        disabled={!this.isAnyStateSelected()}>{stateSelectionConfirmed ?
                        <ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/> : <Text>SAVE</Text>}
                    </Button>
                    {this.state.seedProgress.numberOfStates === 0 ? null : <Text
                        style={[Typography.paperFontSubhead, {
                            color: "white",
                            marginTop: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 20
                        }]}>{`States already loaded - ${this.state.seedProgress.numberOfStates > 10 ? this.state.seedProgress.numberOfStates : this.state.loadedCountryStates}`}</Text>
                    }
                </View>
            </GunakContainer>
        );
    }
}

export default StateSelection;
