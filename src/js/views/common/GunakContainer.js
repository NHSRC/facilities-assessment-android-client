import PropTypes from "prop-types";
import React from "react";
import {Body, Button, Container, Content, Header, Icon, Left, StyleProvider, Title, Right} from "native-base";
import getTheme from '../../native-base-theme/components';
import platformTheme from '../../native-base-theme/variables/platform';
import TypedTransition from "../../framework/routing/TypedTransition";
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";

class GunakContainer extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onHeaderButtonPress: PropTypes.func,
        rightIconName: PropTypes.string,
        onPressRightIcon: PropTypes.func,
        scrollToTop: PropTypes.bool
    };

    scrollToTop() {
        this.refs.scroll._root.scrollToPosition(0, 1, true);
    }

    render() {
        if (this.props.scrollToTop) {
            this.scrollToTop();
        }
        return <StyleProvider style={getTheme(platformTheme)}>
            <Container>
                <Header style={{backgroundColor: PrimaryColors.header}}>
                    <Left>
                        <Button transparent onPress={this.props.onHeaderButtonPress ? this.props.onHeaderButtonPress : () => TypedTransition.from(this).goBack()}>
                            <Icon style={{marginTop: 5, color: "white"}} name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={[Typography.paperFontSubhead, {
                            color: 'white'
                        }]}>{this.props.title}</Title>
                    </Body>
                    {this.props.rightIconName && <Right>
                        <Button transparent onPress={this.props.onPressRightIcon}>
                            <Icon style={{color: "white"}} name={this.props.rightIconName}/>
                        </Button>
                    </Right>}
                </Header>
                <Content contentContainerStyle={{flexDirection: 'column', paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: PrimaryColors.bodyBackground}}
                         keyboardShouldPersistTaps={'always'} ref="scroll">
                    {this.props.children}
                </Content>
            </Container>
        </StyleProvider>;
    }
}

export default GunakContainer;