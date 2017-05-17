import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Input, InputGroup} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import PrimaryColors from '../styles/PrimaryColors';
import Typography from '../styles/Typography';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Remarks extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleRemarks = this.handleRemarks.bind(this);
        this.saving = this.saving.bind(this);
        this.notSaving = this.notSaving.bind(this);
        this.SAVING = {message: 'SAVING...'};
        this.NOT_SAVING = {message: ''};
        this.state = this.NOT_SAVING;
    }

    static styles = StyleSheet.create({
        remarks: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
            marginTop: deviceHeight * .025
        },
        textBox: {
            alignSelf: 'stretch',
            marginTop: 8
        },
        saving: {
            alignSelf: 'flex-end',
            marginTop: deviceHeight * .01
        }
    });

    handleRemarks(remarks) {
        this.saving();
        return this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
            checkpoint: Object.assign(this.props.checkpoint, {remarks: remarks}),
            ...this.props.params
        });
    }

    saving() {
        this.setState(this.SAVING);
    }

    notSaving() {
        this.setState(this.NOT_SAVING);
    }

    render() {
        return (
            <View style={Remarks.styles.remarks}>
                <View style={Remarks.styles.textBox}>
                    <InputGroup borderType='underline'>
                        <Input
                            onEndEditing={this.notSaving}
                            autoCorrect={true}
                            value={this.props.checkpoint.remarks}
                            onChangeText={this.handleRemarks}
                            placeholder='Enter your remarks here...'/>
                    </InputGroup>
                </View>
                <View style={Remarks.styles.saving}>
                    <Text style={[Typography.paperFontCaption, {color: PrimaryColors.medium_black}]}>
                        {this.state.message}
                    </Text>
                </View>
            </View>
        );
    }
}

export default Remarks;