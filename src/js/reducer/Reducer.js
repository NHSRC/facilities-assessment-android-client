import ErrorHandler from "./ErrorHandler";
import EnvironmentConfig from "../views/common/EnvironmentConfig";

const Reducer = {
    factory: (actions, initState, beans) => (state = initState, action) => {
        try {
            if (!(actions.has(action.type))) return state;
            return actions.get(action.type)(state, action, beans);
        } catch (e) {
            if (EnvironmentConfig.inDeveloperMode) throw e;
            ErrorHandler.postError(e, true);
            return state;
        }
    }
};

export default Reducer;