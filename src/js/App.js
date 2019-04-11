import React, {Component} from "react";
import PathRegistry from "./framework/routing/PathRegistry";
import "./views";
import AppStoreFactory from "./store/AppStore";
import Realm from "realm";
import models from "./models";
import BeanRegistry from "./framework/bean/BeanRegistry";
import Logger from "./framework/Logger";
import Config from "react-native-config";
import {Text, View, Alert, Clipboard, NativeModules, Platform} from "react-native";
import SeedProgressService from "./service/SeedProgressService";
import SeedProgress from "./models/SeedProgress";
import EnvironmentConfig from "./views/common/EnvironmentConfig";
import ErrorHandler from "./utility/ErrorHandler";

let routes, beans, appStore, db = undefined;
const {Restart} = NativeModules;

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.seed = this.seed.bind(this);
        this.handleError = this.handleError.bind(this);
        ErrorHandler.set(this.handleError);
        console.log(`IsEmulated: ${EnvironmentConfig.inDeveloperMode}`);
        console.log(`PlatformVersion: ${Platform.Version}`);
        Logger.setCurrentLogLevel(EnvironmentConfig.inDeveloperMode ? Logger.LogLevel.Debug : Logger.LogLevel.Error);
        if (db === undefined) {
            db = new Realm(models);
        }
        this.state = {initialised: false};
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

    handleError(error, stacktrace) {
        this.setState(prevState =>({...prevState, error, stacktrace}));
    }

    seed() {
        if (beans === undefined) {
            beans = BeanRegistry.init(db);
            appStore = AppStoreFactory(beans, this.handleError);
            routes = PathRegistry.routes();
            Logger.logInfo('App', Config);
        }
        clearTimeout(this.timeoutID);
    }

    componentDidMount() {
        this.timeoutID = setTimeout(this.seed, 100);
        this.intervalID = setInterval(() => {
            this.setState({initialised: true});
        }, 500);
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
        let seedProgress = new SeedProgressService(db).getSeedProgress();
        if (!this.state.initialised || seedProgress.loadState < SeedProgress.AppLoadState.LoadedChecklist) {
            return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                <Text style={{color: "white", fontSize: 24}}>
                    {this.state.initialised ? seedProgress.getMessage() : "LOADING..."}
                </Text>
            </View>;
        } else {
            clearInterval(this.intervalID);
            return routes;
        }
    }
}
