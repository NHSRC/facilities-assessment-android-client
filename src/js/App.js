import React, {Component} from "react";
import PathRegistry from "./framework/routing/PathRegistry";
import "./views";
import AppStoreFactory from "./store/AppStore";
import Realm from "realm";
import models from "./models";
import BeanRegistry from "./framework/bean/BeanRegistry";
import Logger from "./framework/Logger";
import Config from "react-native-config";
import {Text, View} from "react-native";

let routes, beans, appStore, db = undefined;

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        Logger.setCurrentLogLevel(Logger.LogLevel.Debug);
        this.state = {seeding: true};
        this.seed = this.seed.bind(this);
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

    seed() {
        if (db === undefined) {
            db = new Realm(models);
            beans = BeanRegistry.init(db);
            appStore = AppStoreFactory(beans);
            routes = PathRegistry.routes();
            Logger.logInfoObject('App', Config);
        }
        this.setState({seeding: false});
    }

    componentDidMount() {
        setTimeout(this.seed, 100);
    }

    render() {
        return this.state.seeding ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                <Text style={{color: "white", fontSize: 24}}>
                    The App is setting up the checklists. Do not close the App. It may take upto 2 Minutes.
                </Text>
            </View>
            : routes;
    }
}