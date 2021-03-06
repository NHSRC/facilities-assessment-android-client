import {Dimensions, Modal, Platform, Text, View} from 'react-native';
import React from 'react';
import AbstractComponent from '../common/AbstractComponent';
import Colors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import {Button, Icon} from "native-base";
import EnvironmentConfig from "../common/EnvironmentConfig";
import PropTypes from 'prop-types';
import _ from "lodash";
import PlatformIndependentProgressBar from "./PlatformIndependentProgressBar";

const {width, height} = Dimensions.get('window');

class ProgressBarModal extends AbstractComponent {
    static propTypes = {
        value: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        failed: PropTypes.bool.isRequired,
        onRetry: PropTypes.func.isRequired,
        onExit: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.createStyles();
    }

    createStyles() {
        this.syncContainerStyle = {
            flex: 1,
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        };

        this.syncBackground = {
            width: width * .7,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 20,
            alignSelf: 'center',
            backgroundColor: Colors.darkGrey,
        };

        this.container = {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
        };

        this.syncTextContent = {
            color: Colors.medium_white,
            lineHeight: 20,
            height: 40,
        };

        this.syncTextErrorContent = {
            color: Colors.red,
            lineHeight: 20,
            height: 40,
        };

        this.percentageText = {
            color: Colors.lighBlue,
        };

        this.modalButton = {
            backgroundColor: Colors.blue,
            alignSelf: 'stretch',
            marginHorizontal: 10,
            flex: 0.5,
            justifyContent:'center'
        }

        this.buttonText = {
            color:'white'
        }
    }

    renderProgressBar() {
        return <View>
            {this.props.value < 1 ?
                (<View>
                    <Text style={[Typography.paperFontTitle, {
                        color: 'white'
                    }]}>{this.props.failed ? "Download failed" : `Download in progress from: ${EnvironmentConfig.serverURL}`}</Text>
                    <Text style={[this.props.failed ? this.syncTextErrorContent : this.syncTextContent, {marginTop: 10}]}>
                        {_.isNil(this.props.message) ? "Starting" : this.props.message}
                    </Text>
                    {PlatformIndependentProgressBar.display(this.props.value)}
                    <Text
                        style={[this.percentageText, {textAlign: 'center'}]}>
                        {((this.props.value) * 100).toFixed(0)}%
                    </Text>
                    {this.props.failed && <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                        <Button style={this.modalButton}
                                onPress={() => this.props.onRetry()}><Text style={this.buttonText}>RETRY</Text></Button>
                        <Button style={ this.modalButton} onPress={() => this.props.onExit()}><Text style={this.buttonText}>EXIT</Text></Button>
                    </View>}
                </View>)
                :
                (<View>
                    <View style={this.container}>
                        <Text
                            style={[this.syncTextContent, {paddingTop: 7}]}>Download completed</Text>
                        <Icon name='check-circle' size={21} style={[{color: Colors.dark_white}]}/>
                    </View>
                    <View style={{paddingTop: 20}}>
                        <Button
                            color={Colors.darkGrey}
                            onPress={() => this.props.onPress()}><Text>OK</Text></Button>
                    </View>
                </View>)}
        </View>;
    }

    //<Text style={{color: "white", fontSize: 24}}>
    // {this.state.initialised ? seedProgress.getMessage() : "LOADING..."}
    // </Text>
    render() {
        return (
            <Modal animationType={'fade'}
                   transparent={true}
                   onRequestClose={() => {
                       alert('Modal has been closed.');
                   }}
                   visible={true}>
                <View style={[this.syncContainerStyle, {backgroundColor: 'rgba(0, 0, 0, 0.25)'}]}
                      key={`spinner_${Date.now()}`}>
                    <View style={{flex: .4}}/>
                    <View style={this.syncBackground}>
                        <View style={{flex: width*.7}}>
                            {this.renderProgressBar()}
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
            </Modal>);
    }
}

export default ProgressBarModal;