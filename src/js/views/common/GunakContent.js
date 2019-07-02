import {Content} from 'native-base';
import React from 'react';
import PrimaryColors from "../styles/PrimaryColors";
import PropTypes from "prop-types";

class GunakContent extends React.Component {
    static propTypes = {
        scrollToTop: PropTypes.bool
    };

    scrollToTop() {
        this.refs.scroll._root.scrollToPosition(0, 1, true);
    }

    render() {
        if (this.props.scrollToTop) {
            this.scrollToTop();
        }
        return <Content contentContainerStyle={{flexDirection: 'column', paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: PrimaryColors.bodyBackground}}
                     keyboardShouldPersistTaps={'always'} ref="scroll">
                {this.props.children}
            </Content>;
    }
}

export default GunakContent;