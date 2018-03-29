import ErrorHandler from "./ErrorHandler";

const Reducer = {
    factory: (actions, initState, beans) => (state = initState, action) => {
        try {
            if (!(actions.has(action.type))) return state;
            return actions.get(action.type)(state, action, beans);
        } catch (e) {
            ErrorHandler.postError(e, true);
            return state;
        }
    }
};

export default Reducer;