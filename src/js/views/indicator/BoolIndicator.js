import {View, StyleSheet, Text} from 'react-native';
import React, {Component} from 'react';
import {Radio, Right} from 'native-base';
import AbstractComponent from '../common/AbstractComponent';
import ValidationErrorMessage from "./ValidationErrorMessage";

class BoolIndicator extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        definition: React.PropTypes.object.isRequired
    };

    toggleFormElementAnswerSelection(value) {
        const answer = this.props.element.getAnswers().find((ans) => ans.concept.uuid === value);
        this.dispatchAction(this.props.actionName, {formElement: this.props.element, answerUUID: answer.concept.uuid});
    }

    render() {
        return (
            <View style={{flexDirection: 'column'}}>
                <View style={{backgroundColor: '#ffffff'}}>
                    <ValidationErrorMessage validationResult={this.props.validationResult}/>
                </View>
                <View>
                    <ListItem>
                        <Text>Yes</Text>
                        <Right>
                            <Radio selected={false}/>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Text>No</Text>
                        <Right>
                            <Radio selected={true}/>
                        </Right>
                    </ListItem>
                </View>
            </View>);
    }
}

export default BoolIndicator;