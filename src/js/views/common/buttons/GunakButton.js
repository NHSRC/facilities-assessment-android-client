import React from "react";
import {Button} from "native-base";
import platformTheme from "../../../native-base-theme/variables/platform";

class GunakButton extends React.Component {
    static propTypes = {
    };

    render() {
        return <Button {...this.props} style={[{paddingHorizontal: platformTheme.buttonHorizontalPadding}, this.props.style]}>
            {this.props.children}
        </Button>
    }
}

export default GunakButton;