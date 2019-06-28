import {Platform, Text} from 'react-native';
import React from 'react';
import AbstractComponent from './AbstractComponent';
import Typography from "../styles/Typography";
import PropTypes from 'prop-types';

class FieldLabel extends AbstractComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        style: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Text style={[Platform.OS === 'ios' ? Typography.paperFontSubhead : Typography.paperFontTitle, this.props.style]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldLabel;