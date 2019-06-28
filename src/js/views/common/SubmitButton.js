import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Button} from 'native-base';
import {StyleSheet} from 'react-native';
import PrimaryColors from "../styles/PrimaryColors";
import PropTypes from 'prop-types';
import _ from 'lodash';

class SubmitButton extends AbstractComponent {
    static styles = StyleSheet.create({
        blockButton: {
            backgroundColor: PrimaryColors.blue,
        },
    });

    static propTypes = {
        showButton: PropTypes.bool
    };

    render() {
        let showButton = _.isNil(this.props.showButton) ? true : this.props.showButton;
        return (
            <Button
                onPress={this.props.onPress}
                style={[SubmitButton.styles.blockButton, this.props.buttonStyle, showButton ?
                    {} : {backgroundColor: PrimaryColors.medium_black}]}
                block
                disabled={!showButton}>
                {this.props.buttonText}
            </Button>
        );
    }
}

export default SubmitButton;
