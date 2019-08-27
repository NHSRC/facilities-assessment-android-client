import PropTypes from "prop-types";
import React from "react";
import {Body, Button, Container, Content, Header, Icon, Left, StyleProvider, Title, Right} from "native-base";
import getTheme from '../../native-base-theme/components';
import platformTheme from '../../native-base-theme/variables/platform';
import TypedTransition from "../../framework/routing/TypedTransition";
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";
import GunakContent from "./GunakContent";

class GunakContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static contextTypes = {
        navigator: PropTypes.func.isRequired
    };

    static propTypes = {
        title: PropTypes.string.isRequired,
        onHeaderButtonPress: PropTypes.func,
        rightIconName: PropTypes.string,
        onPressRightIcon: PropTypes.func,
        scrollToTop: PropTypes.bool,
        hideBack: PropTypes.bool
    };

    render() {
        return <StyleProvider style={getTheme(platformTheme)}>
            <Container>
                <Header style={{backgroundColor: PrimaryColors.header}}>
                    <Left style={{flex: 0.1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                        {this.props.hideBack ? null :
                            <Button transparent onPress={this.props.onHeaderButtonPress ? this.props.onHeaderButtonPress : () => TypedTransition.from(this).goBack()}>
                                <Icon style={{color: "white"}} name='arrow-back'/>
                            </Button>}
                    </Left>
                    <Body style={{flexGrow: 1}}>
                        <Title style={[Typography.paperFontSubhead, {
                            color: 'white', alignSelf: 'flex-start'
                        }]} ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Title>
                    </Body>
                    {this.props.rightIconName && <Right style={{flex:0.2}}>
                        <Button transparent onPress={this.props.onPressRightIcon}>
                            <Icon style={{color: "white"}} name={this.props.rightIconName}/>
                        </Button>
                    </Right>}
                </Header>
                <GunakContent>
                    {this.props.children}
                </GunakContent>
            </Container>
        </StyleProvider>;
    }
}

export default GunakContainer;