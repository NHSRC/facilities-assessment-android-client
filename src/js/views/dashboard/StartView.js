import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {List, ListItem, InputGroup, Input, Picker} from 'native-base';
import Typography from '../styles/Typography';
import Dashboard from './Dashboard';

const deviceWidth = Dimensions.get('window').width;


class StartView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        // const store = context.getStore();
        // this.state = store.getState().dashboard;
        // this.unsubscribe = store.subscribeTo('dashboard', this.handleChange.bind(this));
        // this.handleOnPress = this.handleOnPress.bind(this);
    }

    static styles = StyleSheet.create({
        subheader: {
            color: "#000",
            marginLeft: 24,
            marginTop: 26,
        },
        pickerContainer: {
            marginLeft: deviceWidth * .04,
            flex: .5,
            borderBottomWidth: 1,
            borderBottomColor: "#1f0000",
            borderStyle: "solid",
        },
        formRow: {
            borderBottomWidth: 0
        }
    });


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
        const Item = Picker.Item;
        return (
            <View style={Dashboard.styles.tab}>
                <Text style={[Typography.paperFontSubhead, StartView.styles.subheader]}>START ASSESSMENT</Text>
                <List>
                    <ListItem style={StartView.styles.formRow}>
                        <View style={StartView.styles.pickerContainer}>
                            <Picker
                                mode={"dropdown"}>
                                <Item label="Ok" value="punjab"/>
                                <Item label="Karnataka" value="karnataka"/>
                            </Picker>
                        </View>

                        <View style={[StartView.styles.pickerContainer, {marginRight: deviceWidth * .04,}]}>
                            <Picker
                                mode={"dropdown"}>
                                <Item label="Ramesh" value="ramesh"/>
                                <Item label="Suresh" value="suresh"/>
                            </Picker>
                        </View>
                    </ListItem>

                </List>
            </View>
        );
    }
}

export default StartView;