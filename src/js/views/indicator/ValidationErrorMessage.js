import {View} from 'react-native';
import React from 'react';
import AbstractComponent from '../common/AbstractComponent';
import {Text} from "native-base";
import _ from "lodash";

class ValidationErrorMessage extends AbstractComponent {
    static propTypes = {
        validationResult: React.PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return _.isNil(this.props.validationResult) || this.props.validationResult.success ? <View/> : <Text style={{color: '#d0011b', flex: 0.3}}>{this.props.validationResult.message}</Text>;
    }
}

export default ValidationErrorMessage;