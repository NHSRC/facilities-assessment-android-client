import React, {Component} from "react";
import PathRegistry from "./framework/routing/PathRegistry";
import "./views";
import AppStoreFactory from "./store/AppStore";
import Realm from "realm";
import models from "./models";
import BeanRegistry from "./framework/bean/BeanRegistry";
import Logger from "./framework/Logger";
import {ActivityIndicator, Text, View} from "react-native";
import PrimaryColors from "./views/styles/PrimaryColors";

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        Logger.setCurrentLogLevel(Logger.LogLevel.Debug);
        this.db = new Realm(models);
        this.state = {seeding: true};
    }

    static childContextTypes = {
        getStore: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        getStore: () => this.appStore,
        getService: (serviceName) => {
            return this.beans.get(serviceName);
        }
    });

    componentDidMount() {
        setTimeout(() => {
            this.beans = BeanRegistry.init(this.db);
            this.routes = PathRegistry.routes();
            this.appStore = AppStoreFactory(this.beans);
            this.setState({seeding: false});
        }, 100);

    }

    render() {
        return this.state.seeding ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                <Text style={{color: "white", fontSize: 24}}>
                    The App is being setup. Do not close the App.
                </Text>
            </View>) : this.routes;

    }
}