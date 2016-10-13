import React, {Component} from 'react';
import {Button, Icon} from 'native-base';
import AbstractComponent from "./AbstractComponent";
import PrimaryColors from "../styles/PrimaryColors";

class SubmitButton extends AbstractComponent {
    render() {
        return (
            <Button onPress={this.props.onPress}
                    style={{backgroundColor: PrimaryColors.textBold}}
                    primary
                    block>
                <Icon name={this.props.buttonIcon}/>
                {this.props.buttonText}
            </Button>);
    }
}

export default SubmitButton;