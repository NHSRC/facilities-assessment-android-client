import {Text} from 'react-native';
import React from 'react';
import AbstractComponent from './AbstractComponent';
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";
import PropTypes from 'prop-types';

class FieldValue extends AbstractComponent {
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Text style={[Typography.paperFontSubhead, {color: PrimaryColors.complete}]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldValue;