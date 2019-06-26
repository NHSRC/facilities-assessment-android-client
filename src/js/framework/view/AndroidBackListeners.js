import _ from "lodash";
import {BackHandler} from 'react-native';
import Logger from "../Logger";

class AndroidBackListeners {
    constructor(router) {
        this.router = router;
        this.viewListeners = [];
        BackHandler.addEventListener('hardwareBackPress', this.backPressed.bind(this));
    }

    backPressed() {
        this.logListeners();
        let b = this.router.onBack();
        let viewListener = _.last(this.viewListeners);
        if (!_.isNil(viewListener) && viewListener.path === this.router.currentPath) {
            viewListener.cb();
        }
        //no return values from listener yet, all back buttons are permissive
        return b;
    }

    remove() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    logListeners() {
        Logger.logDebug('AndroidBackListeners', this.viewListeners.map((listener) => listener.path));
    }

    addListener(path, listener) {
        this.viewListeners.push({path: path, cb: listener});
        this.logListeners();
    }

    removeListener() {
        _.pullAt(this.viewListeners, this.viewListeners.length - 1);
    }
}

export default AndroidBackListeners;