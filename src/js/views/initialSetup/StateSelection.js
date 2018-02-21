import {ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import Path, {PathRoot} from "../../framework/routing/Path";
import {Button, Container, Content, Footer, Header, Icon, Title} from "native-base";
import Typography from "../styles/Typography";
import FlatUITheme from "../themes/flatUI";
import TypedTransition from "../../framework/routing/TypedTransition";
import ModeSelection from "../modes/ModeSelection";
import Logger from "../../framework/Logger";
import _ from 'lodash';
import Actions from "../../action";

@PathRoot
@Path('/StateSelection')
class StateSelection extends AbstractComponent {
    constructor(props, context) {
        super(props, context, 'stateSelection');
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        }
    });

    componentWillMount() {
        this.dispatchAction(Actions.STATE_SELECTION_LOADED, {params: this.props.params});
    }

    stateSelectionConfirmed() {
        this.dispatchAction(Actions.STATE_SELECTION_CONFIRMED, {start: false});
        setTimeout(() => {
            this.dispatchAction(Actions.STATE_SELECTION_CONFIRMED, {start: true});
            TypedTransition.from(this).resetTo(ModeSelection);
        }, 100);
    }

    toggleState(countryState) {
        this.dispatchAction(Actions.TOGGLE_STATE, {countryState: countryState});
    }

    isItTheSelectedState(countryState) {
        return this.isAnyStateSelected() && this.state.selectedState.uuid === countryState.uuid;
    };

    isAnyStateSelected() {
        return !_.isNil(this.state.selectedState);
    };

    render() {
        if (_.isNil(this.state)) {
            Logger.logDebug('StateSelection', 'renderEmpty');
            return <View/>;
        } else if (!this.state.displayStateSelection) {
            Logger.logDebug('StateSelection', 'Transitioning');
            this.dispatchAction(Actions.MODE_SELECTION);
            TypedTransition.from(this).resetTo(ModeSelection);
            return <View/>;
        }

        Logger.logDebug('StateSelection', 'render');

        return (
            <Container theme={FlatUITheme}>
                <Header style={StateSelection.styles.header}>
                    <Button transparent onPress={() => TypedTransition.from(this).goBack()}>
                        <Icon style={{marginTop: 5, color: "white"}} name='arrow-back'/>
                    </Button>
                    <Title style={[Typography.paperFontSubhead, {
                        color: 'white'
                    }]}>Select state of health facilities</Title>
                </Header>
                <Content>
                    <View style={{flexDirection: 'column', margin: 8, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                        {this.state.allStates.map((countryState) =>
                            <View style={{marginTop: 5, justifyContent: 'center', alignItems: 'center'}} key={countryState.name}>
                                <TouchableHighlight key={countryState.name} onPress={() => this.toggleState(countryState)}>
                                    <View style={{flexDirection: 'row', height: 32}}>
                                        <Text style={{color: "white"}}>{countryState.name}</Text>
                                        {this.isItTheSelectedState(countryState) ?
                                            <Icon name='done' style={{fontSize: 20, color: "white", marginLeft: 10}} size={100}/> :
                                            <View/>}
                                    </View>
                                </TouchableHighlight>
                                <Text style={{height: 0.5, backgroundColor: "white", width: 200}}/>
                            </View>)}
                        <Button
                            onPress={() => this.stateSelectionConfirmed()}
                            style={{backgroundColor: '#ffa000', marginTop: 20}}
                            block
                            disabled={!this.isAnyStateSelected()}>{this.state.busy ?
                            (<ActivityIndicator animating={true} size={"large"} color="white"
                                                style={{height: 80}}/>) :
                            "SAVE"}
                        </Button>
                        {_.isEmpty(this.state.loadedCountryStates) ? null : <Text
                            style={[Typography.paperFontSubhead, {
                                color: "white",
                                marginTop: 30
                            }]}>{`States already loaded - ${this.state.numberOfStatesLoaded > 10 ? this.state.numberOfStatesLoaded : this.state.loadedCountryStates}`}</Text>
                        }
                    </View>
                </Content>
            </Container>
        );
    }
}

export default StateSelection;