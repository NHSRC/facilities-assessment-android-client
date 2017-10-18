import {Platform} from "react-native";

class Fonts {
    static get HelveticaNeueOrRobotoMedium() {
        return (Platform.OS === 'ios' ) ? 'HelveticaNeue' : 'Roboto_medium'
    }
}

export default Fonts;