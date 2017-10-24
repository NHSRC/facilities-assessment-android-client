import {Platform} from "react-native";

class Fonts {
    static get HelveticaNeueOrRobotoMedium() {
        return (Platform.OS === 'ios' ) ? 'HelveticaNeue' : 'Roboto_medium';
    }

    static get HelveticaNeueOrRobotoNoto() {
        return (Platform.OS === 'ios' ) ? 'HelveticaNeue' : 'Roboto,Noto,sans-serif';
    }
}

export default Fonts;