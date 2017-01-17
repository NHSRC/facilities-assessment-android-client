import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import {List, ListItem, InputGroup, Radio, Picker} from 'native-base';
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
        },
        pickerContainer: {
            flex: .5,
            borderBottomWidth: 1,
            borderBottomColor: "#1F000012",
            borderStyle: "solid",
        },
        radioContainer: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: "space-between",
        },
        formRow: {
            borderBottomWidth: 0,
            marginLeft: 0
        },
        formQuestionText: {},
        radioButtonContainer: {
            flex: .3,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: "space-around"
        },
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
                        <View style={[StartView.styles.pickerContainer, {marginRight: deviceWidth * 0.04}]}>
                            <Picker
                                mode={"dropdown"}>
                                <Item label="Ok" value="punjab"/>
                                <Item label="Karnataka" value="karnataka"/>
                            </Picker>
                        </View>

                        <View style={[StartView.styles.pickerContainer]}>
                            <Picker
                                mode={"dropdown"}>
                                <Item label="Ramesh" value="ramesh"/>
                                <Item label="Suresh" value="suresh"/>
                            </Picker>
                        </View>
                    </ListItem>
                    <ListItem style={StartView.styles.formRow}>
                        <View style={StartView.styles.pickerContainer}>
                            <Picker
                                mode={"dropdown"}>
                                <Item label="Ok" value="punjab"/>
                                <Item label="Karnataka" value="karnataka"/>
                            </Picker>
                        </View>
                    </ListItem>
                    <ListItem style={StartView.styles.formRow}>
                        <View style={StartView.styles.pickerContainer}>
                            <Picker
                                mode={"dropdown"}>
                                <Item label="Ok" value="punjab"/>
                                <Item label="Karnataka" value="karnataka"/>
                            </Picker>
                        </View>
                    </ListItem>
                    <ListItem style={StartView.styles.formRow}>
                        <View style={StartView.styles.radioContainer}>
                            <View style={{flex: .7}}>
                                <Text style={[Typography.paperFontSubhead]}>Assessment Type</Text>
                            </View>
                            <View style={StartView.styles.radioButtonContainer}>
                                <Radio/>
                                <Text style={[Typography.paperFontBody2, {color: '#000'}]}>Internal</Text>
                                <Radio/>
                                <Text style={[Typography.paperFontBody2, {color: '#000'}]}>External</Text>
                            </View>
                        </View>
                    </ListItem>
                </List>
            </View>
        );
    }
}

export default StartView;