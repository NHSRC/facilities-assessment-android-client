import React, {Component} from "react";
import PathRegistry from "./framework/routing/PathRegistry";
import "./views";
import AppStoreFactory from "./store/AppStore";
import Realm from "realm";
import models from "./models";
import BeanRegistry from "./framework/bean/BeanRegistry";
import Logger from "./framework/Logger";
import Config from "./framework/Config";
import {Alert, BackHandler, Clipboard, Dimensions, Image, NativeModules, Text, View} from "react-native";
import SeedProgressService from "./service/SeedProgressService";
import SeedProgress from "./models/SeedProgress";
import EnvironmentConfig from "./views/common/EnvironmentConfig";
import ErrorHandler from "./utility/ErrorHandler";
import ProgressBarModal from "./views/progressBar/ProgressBarModal";
import SeedDataService from "./service/SeedDataService";
import PropTypes from 'prop-types';
import _ from "lodash";
import GunakContainer from "./views/common/GunakContainer";

const nhsrcbanner = require('./views/img/nhsrcbanner.png');

const deviceWidth = Dimensions.get('window').width;

let routes, beans, appStore, db = undefined;
const {Restart} = NativeModules;

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.init = this.init.bind(this);
        this.handleError = this.handleError.bind(this);
        ErrorHandler.set(this.handleError);
        Logger.setCurrentLogLevel(EnvironmentConfig.isEmulated ? Logger.LogLevel.Debug : Logger.LogLevel.Error);
        if (db === undefined) {
            Logger.logDebug('App.Constructor', "Database not defined");
            db = new Realm(models);
            Logger.logDebug('App.Constructor', "Database defined");
        } else {
            Logger.logDebug('App.Constructor', "Database already defined");
        }
        this.state = {initialised: false};
    }

    static childContextTypes = {
        getStore: PropTypes.func.isRequired,
        getService: PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        getStore: () => appStore,
        getService: (serviceName) => {
            return beans.get(serviceName);
        }
    });

    handleError(error, stacktrace) {
        this.setState(prevState => ({...prevState, error, stacktrace}));
    }

    init() {
        Logger.logDebug('App', 'Init');
        if (beans === undefined) {
            beans = BeanRegistry.init(db);
            appStore = AppStoreFactory(beans, this.handleError);
            App.resetSync();
            routes = PathRegistry.routes();
            Logger.logInfo('App', Config);
        }
        clearTimeout(this.timeoutID);
    }

    componentDidMount() {
        Logger.logDebug('App', 'componentDidMount');
        this.timeoutID = setTimeout(this.init, 300);
        this.setRefreshTimer();
    }

    setRefreshTimer() {
        this.intervalID = setInterval(() => {
            Logger.logDebug('App', 'Interval trigger');
            this.setState({initialised: true});
        }, 500);
    }

    renderError() {
        console.log('[App][renderError] Render error dialog');
        Alert.alert("App will restart now", this.state.error.message,
            [
                {
                    text: "Copy error and Restart",
                    onPress: () => {
                        Clipboard.setString(`${this.state.error.message}\nStacktrace:\n${this.state.stacktrace}`);
                        console.log(`[App.renderError] Restarting app.`);
                        Restart.restart();
                    }
                }
            ],
            {cancelable: false}
        );
        return null;
    }

    onRetrySync() {
        App.resetSync();
        beans.get(SeedDataService).postInit();
        this.setRefreshTimer();
    }

    static resetSync() {
        let seedProgressService = new SeedProgressService(db);
        seedProgressService.initialise();
        seedProgressService.resetSync();
    }

    static onExit() {
        BackHandler.exitApp();
    }

    render() {  
        Logger.logDebug('App', 'render');
        if (!_.isNil(this.state.error)) {
            return this.renderError();
        }

        let seedProgress = new SeedProgressService(db).initialise().getSeedProgress();
        let checklistsNotLoaded = seedProgress.loadState < SeedProgress.AppLoadState.LoadedChecklist;
        Logger.logDebug('App', `${JSON.stringify(seedProgress)}, initialised: ${this.state.initialised}`);

        if (!_.isNil(seedProgress.error) && !_.isNil(this.intervalID)) {
            Logger.logDebug('App', 'Clearing refresh timer');
            clearInterval(this.intervalID);
        }

        if (this.state.initialised && !checklistsNotLoaded) {
            clearInterval(this.intervalID);
            return routes;
        }

        return <GunakContainer title="GUNAK (गुणक)">
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                {checklistsNotLoaded ?
                    <ProgressBarModal message={seedProgress.syncMessage} value={seedProgress.syncProgress} failed={!_.isNil(seedProgress.error)}
                                      onRetry={() => this.onRetrySync()} onExit={() => App.onExit()}/> :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 8}}>
                        <Text style={{color: "white", fontSize: 24}}>LOADING...</Text>
                    </View>
                }
            </View>
            <Image resizeMode="contain" style={{width: deviceWidth}} source={nhsrcbanner}/>
        </GunakContainer>;
    }
}