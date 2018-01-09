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
import SeedProgressService from "./service/SeedProgressService";
import SeedProgress from "./models/SeedProgress";
import EnvironmentConfig from "./views/common/EnvironmentConfig";

let routes, beans, appStore, db = undefined;

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        Logger.setCurrentLogLevel(EnvironmentConfig.isEmulated ? Logger.LogLevel.Debug : Logger.LogLevel.Error);
        this.seed = this.seed.bind(this);
        let loadState;
        if (db === undefined) {
            db = new Realm(models);
        }
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

    seed() {
        if (beans === undefined) {
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
        let loadState = new SeedProgressService(db).getSeedProgress().loadState;
        return this.state.seeding ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                <Text style={{color: "white", fontSize: 24}}>
                    {(loadState >= SeedProgress.AppLoadState.LoadedChecklist || !EnvironmentConfig.shouldUsePackagedSeedData) ? 'LOADING...' : 'Setting up checklists. It may take up to 2 Minutes, depending on your device. Do not close the App.'}
                </Text>
            </View>
            : routes;
    }
}