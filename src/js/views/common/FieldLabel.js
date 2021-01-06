import {Platform, Text} from 'react-native';
import React from 'react';
import AbstractComponent from './AbstractComponent';
import Typography from "../styles/Typography";
import PropTypes from 'prop-types';

class FieldLabel extends AbstractComponent {
    static propTypes = {
        text: PropTypes.string,
        style: PropTypes.object,
        isHelpText: PropTypes.bool.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        let typography;
        if (Platform.OS === 'ios') {
            typography = this.props.isHelpText ? Typography.paperFontBody1 : Typography.paperFontSubhead;
        } else {
            typography = this.props.isHelpText ? Typography.paperFontBody1 : Typography.paperFontTitle;
        }
        return (
            <Text style={[typography, this.props.style]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldLabel;