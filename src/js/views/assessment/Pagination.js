import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import PageMarker from './PageMarker';
import AbstractComponent from "../common/AbstractComponent";
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
            marginTop: deviceHeight * .088,
            alignSelf: 'stretch',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }
    });

    handleOnPress(checkpoint) {
        return () => {
            this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: checkpoint});
        };
    }

    render() {
        const pages = this.props.checkpoints.map((checkpoint, idx) =>
            (<PageMarker
                key={idx}
                handleOnPress={this.handleOnPress(checkpoint)}
                checkpoint={checkpoint}
                current={this.props.currentCheckpoint.uuid === checkpoint.uuid}
                saved={_.isNumber(checkpoint.score)}/>));
        return (
            <View style={Pagination.styles.container}>
                {pages}
            </View>
        );
    }
}

export default Pagination;