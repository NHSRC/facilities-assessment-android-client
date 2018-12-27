import React, {Component} from "react";
import PathRegistry from "./framework/routing/PathRegistry";
import "./views";
import AppStoreFactory from "./store/AppStore";
import Realm from "realm";
import models from "./models";
import BeanRegistry from "./framework/bean/BeanRegistry";
import Logger from "./framework/Logger";
import Config from "react-native-config";
import {Text, View, Alert, Clipboard, NativeModules} from "react-native";
import SeedProgressService from "./service/SeedProgressService";
import SeedProgress from "./models/SeedProgress";
import EnvironmentConfig from "./views/common/EnvironmentConfig";
import ErrorHandler from "./utility/ErrorHandler";

const {Restart} = NativeModules;
let routes, beans, appStore, db = undefined;

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.seed = this.seed.bind(this);
        this.handleError = this.handleError.bind(this);
        ErrorHandler.set(this.handleError);
        console.log(`IsEmulated: ${EnvironmentConfig.inDeveloperMode}`);
        Logger.setCurrentLogLevel(EnvironmentConfig.inDeveloperMode ? Logger.LogLevel.Debug : Logger.LogLevel.Error);
        if (db === undefined) {
            db = new Realm(models);
        }
        this.state = {seeding: true, error: null};
    }

    static childContextTypes = {
        getStore: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired,
    };

    handleError(error, stacktrace) {
        this.setState(prevState =>({...prevState, error, stacktrace}));
    }

    getChildContext = () => ({
        getStore: () => appStore,
        getService: (serviceName) => {
            return beans.get(serviceName);
        }
    });

    seed() {
        if (beans === undefined) {
            beans = BeanRegistry.init(db);
            appStore = AppStoreFactory(beans, this.handleError);
            routes = PathRegistry.routes();
            Logger.logInfo('App', Config);
        }
        this.setState(prevState => ({...prevState, seeding: false}));
    }

    componentDidMount() {
        setTimeout(this.seed, 100);
    }

    renderError() {
        console.log('[App][renderError] Render error dialog');
        Alert.alert("App will restart now", this.state.error.message,
            [
                {text: "Copy error and Restart",
                    onPress: () => {
                        Clipboard.setString(`${this.state.error.message}\nStacktrace:\n${this.state.stacktrace}`);
                        Restart.restart();
                    }
                }
            ],
            {cancelable: false}
        );
        return null;
    }

    render() {
        if (!_.isNil(this.state.error)) {
            return this.renderError();
        }
        else {
            let loadState = new SeedProgressService(db).getSeedProgress().loadState;
            return this.state.seeding ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                    <Text style={{color: "white", fontSize: 24}}>
                        {(loadState >= SeedProgress.AppLoadState.LoadedChecklist) || !EnvironmentConfig.shouldUsePackagedSeedData ? 'LOADING...' : 'Setting up checklists. It may take up to 2 Minutes, depending on your device. Do not close the App.'}
                    </Text>
                </View>
                : routes;
        }
    }
}
