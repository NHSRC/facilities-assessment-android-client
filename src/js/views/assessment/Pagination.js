import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import PageMarker from './PageMarker';
import AbstractComponent from "../common/AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";
import Actions from '../../action';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Pagination extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    static styles = StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
        }
    });

    handleOnPress(checkpoint) {
        return () => {
            console.log("\n\n");
            console.log(checkpoint.checkpoint.name);
            console.log("\n\n");
        };
    }

    render() {
        const pages = this.props.checkpoints.map((checkpoint, idx) =>
            (<PageMarker
                key={idx}
                handleOnPress={this.handleOnPress(checkpoint)}
                checkpoint={checkpoint}
                current={this.props.currentCheckpoint.uuid === checkpoint.uuid}
                saved={!_.isEmpty(checkpoint.score)}/>));
        return (
            <View style={Pagination.styles.container}>
                {pages}
            </View>
        );
    }
}

export default Pagination;