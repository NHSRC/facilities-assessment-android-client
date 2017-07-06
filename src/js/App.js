import React, {Component} from "react";
import PathRegistry from "./framework/routing/PathRegistry";
import "./views";
import AppStoreFactory from "./store/AppStore";
import Realm from "realm";
import models from "./models";
import BeanRegistry from "./framework/bean/BeanRegistry";
import Logger from "./framework/Logger";
import {Text, View} from "react-native";

var routes;
var beans;
var appStore;
var db;

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        Logger.setCurrentLogLevel(Logger.LogLevel.Debug);
        this.state = {seeding: true};
    }

    static childContextTypes = {
        getStore: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        getStore: () => appStore,
        getService: (serviceName) => {
            return beans.get(serviceName);
        }
    });

    componentDidMount() {
        if (db === undefined) {
            db = new Realm(models);
            beans = BeanRegistry.init(db);
            appStore = AppStoreFactory(beans);
            routes = PathRegistry.routes();
        }
        setTimeout(() => this.setState({seeding: false}), 100);
    }

    render() {
        return this.state.seeding ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                <Text style={{color: "white", fontSize: 24}}>
                    The App is being setup. Do not close the App. It may take upto 5 Minutes.
                </Text>
            </View>) : routes;
    }
}
