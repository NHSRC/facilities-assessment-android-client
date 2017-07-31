import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import _ from 'lodash';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import TypedTransition from "../../framework/routing/TypedTransition";
import Path from "../../framework/routing/Path";
import Typography from "../styles/Typography";

const deviceWidth = Dimensions.get('window').width;

@Path("/certification")
class Certification extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().certification;
        this.unsubscribe = store.subscribeTo('certification', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().certification;
        this.setState(newState);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillMount() {
        this.dispatchAction(Actions.RUN_CERTIFICATION_CRITERIA, {...this.props.params});
    }

    render() {
        let Criteria = this.state.criteria.map((criteria, idx) =>
            <Text key={idx} style={[Typography.paperFontHeadline, {color: 'white'}]}>
                {criteria.name} - {String(criteria.certified)}
            </Text>);
        return (
            <View>
                <Text style={[Typography.paperFontHeadline, {color: 'white'}]}>
                    Certification - {String(this.state.certified)}
                </Text>
                {Criteria}
            </View>
        );
    }
}

export default Certification;
