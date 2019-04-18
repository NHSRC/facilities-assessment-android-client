import {View, StyleSheet, Text, Modal, Dimensions, ProgressBarAndroid} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from '../common/AbstractComponent';
import Colors from "../styles/PrimaryColors";
import Typography from "../styles/Typography";
import {Button, Icon} from "native-base";

const {width, height} = Dimensions.get('window');

class ProgressBarModal extends AbstractComponent {
    static propTypes = {
        value: React.PropTypes.number.isRequired,
        message: React.PropTypes.string.isRequired,
        failed: React.PropTypes.bool.isRequired,
        onRetry: React.PropTypes.func.isRequired,
        onExit: React.PropTypes.func.isRequired,
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
    }

    renderProgressBar() {
        return <View>
            {this.props.value < 1 ?
                (<View>
                    <Text style={[Typography.paperFontTitle, {
                        color: 'white'
                    }]}>{this.props.failed ? "Download failed" : "Download in progress"}</Text>
                    <Text style={[this.props.failed ? this.syncTextErrorContent : this.syncTextContent, {marginTop: 10}]}>
                        {_.isNil(this.props.message) ? "Starting" : this.props.message}
                    </Text>
                    <ProgressBarAndroid styleAttr="Horizontal" progress={this.props.value}
                                        indeterminate={false} color="white"/>
                    <Text
                        style={[this.percentageText, {textAlign: 'center'}]}>
                        {((this.props.value) * 100).toFixed(0)}%
                    </Text>
                    {this.props.failed && <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                        <Button style={{backgroundColor: Colors.blue, alignSelf: 'stretch', marginHorizontal: 10, flex: 0.5}}
                                onPress={() => this.props.onRetry()}>RETRY</Button>
                        <Button style={{
                            backgroundColor: Colors.blue,
                            alignSelf: 'stretch',
                            marginHorizontal: 10,
                            flex: 0.5
                        }} onPress={() => this.props.onExit()}>EXIT</Button>
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
                            title="OK"
                            color={Colors.darkGrey}
                            onPress={() => this.props.onPress()}/>
                    </View>
                </View>)}
        </View>;
    }

    //<Text style={{color: "white", fontSize: 24}}>
    //                     {this.state.initialised ? seedProgress.getMessage() : "LOADING..."}
    //                 </Text>
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
                        <View style={{flex: .7}}>
                            {this.renderProgressBar()}
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
            </Modal>);
    }
}

export default ProgressBarModal;