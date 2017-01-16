import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Dashboard from './Dashboard';
import {Title, Content, Icon, Button} from 'native-base';



class OpenView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        // const store = context.getStore();
        // this.state = store.getState().dashboard;
        // this.unsubscribe = store.subscribeTo('dashboard', this.handleChange.bind(this));
        // this.handleOnPress = this.handleOnPress.bind(this);
    }


    handleChange() {
        // const newState = this.context.getStore().getState().dashboard;
        // this.setState(newState);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        // this.unsubscribe();
    }

    render() {
        return (
            <View style={Dashboard.styles.tab}>

            </View>
        );
    }
}

export default OpenView;