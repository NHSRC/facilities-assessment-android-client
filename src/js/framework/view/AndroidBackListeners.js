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
        return this.router.onBack();
    }

    remove() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    logListeners() {
        Logger.logDebug('AndroidBackListeners', this.viewListeners.map((listener) => listener.path));
    }
}

export default AndroidBackListeners;