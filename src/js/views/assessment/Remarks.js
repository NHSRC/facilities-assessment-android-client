import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Input, InputGroup} from 'native-base';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Remarks extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleRemarks = this.handleRemarks.bind(this);
    }

    static styles = StyleSheet.create({
        remarks: {
            alignSelf: 'stretch',
            marginTop: deviceHeight * .025
        },
    });

    handleRemarks(remarks) {
        return this.dispatchAction(Actions.UPDATE_CHECKPOINT, {
            checkpoint: Object.assign(this.props.checkpoint, {remarks: remarks})
        });
    }

    render() {
        return (
            <View style={Remarks.styles.remarks}>
                <InputGroup borderType='underline'>
                    <Input
                        autoCorrect={true}
                        value={this.props.checkpoint.remarks}
                        onChangeText={this.handleRemarks}
                        placeholder='Enter your comment here...'/>
                </InputGroup>
            </View>
        );
    }
}

export default Remarks;