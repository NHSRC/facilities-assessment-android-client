import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Button, Text} from 'native-base';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import PrimaryColors from "../styles/PrimaryColors";
import PropTypes from 'prop-types';
import _ from 'lodash';

class SubmitButton extends AbstractComponent {
    static propTypes = {
        showButton: PropTypes.bool,
        buttonStyle: PropTypes.object,
        busy: PropTypes.bool,
        buttonText: PropTypes.string,
        onPress: PropTypes.func,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        showButton: true,
        busy: false,
        buttonText: "SUBMIT",
        disabled: false
    };

    renderSpinner() {
        return (<ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/>);
    }

    render() {
        let buttonStyle = [{backgroundColor: this.props.disabled ? PrimaryColors.medium_black : PrimaryColors.blue}, this.props.buttonStyle];
        return this.props.showButton && <Button
            onPress={this.props.onPress}
            style={buttonStyle}
            disabled={this.props.disabled}
            block>
            {this.props.busy ? this.renderSpinner() : <Text>{this.props.buttonText}</Text>}
        </Button>;
    }
}

export default SubmitButton;
