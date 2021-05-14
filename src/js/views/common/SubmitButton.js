import React from 'react';
import AbstractComponent from "../common/AbstractComponent";
import {Button, Text} from 'native-base';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
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
        showButton: PropTypes.bool,
        buttonStyle: PropTypes.object,
        busy: PropTypes.bool,
        buttonText: PropTypes.string,
        onPress: PropTypes.func
    };

    static defaultProps = {
        showButton: true,
        busy: false,
        buttonText: "SUBMIT"
    };

    renderSpinner() {
        return (<ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/>);
    }

    render() {
        return (
            <View>
                {this.props.showButton && <Button
                    onPress={this.props.onPress}
                    style={[SubmitButton.styles.blockButton, this.props.buttonStyle, this.props.showButton ?
                        {} : {backgroundColor: PrimaryColors.medium_black}]}
                    block>
                    {this.props.busy ? this.renderSpinner() : <Text>{this.props.buttonText}</Text>}
                </Button>}
            </View>
        );
    }
}

export default SubmitButton;
