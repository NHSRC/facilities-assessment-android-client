import ErrorHandler from "../utility/ErrorHandler";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

const Reducer = {
    factory: (actions, initState, beans, errorCallback) => (state = initState, action) => {
        try {
            if (!(actions.has(action.type))) return state;
            return actions.get(action.type)(state, action, beans);
        } catch (e) {
            if (EnvironmentConfig.inDeveloperMode) throw e;
            ErrorHandler.postError(e, true, errorCallback);
            return state;
        }
    }
};

export default Reducer;
