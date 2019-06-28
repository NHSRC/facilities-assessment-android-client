import PropTypes from "prop-types";
import React from "react";
import {Container, StyleProvider, Header, Left, Button, Icon, Body, Title, Content} from "native-base";
import getTheme from '../../native-base-theme/components';
import platformTheme from '../../native-base-theme/variables/platform';
import TypedTransition from "../../framework/routing/TypedTransition";
import Typography from "../styles/Typography";

class GunakContainer extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onHeaderButtonPress: PropTypes.func
    };

    render() {
        return <StyleProvider style={getTheme(platformTheme)}>
            <Container>
                <Header>
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
                </Header>
                <Content contentContainerStyle={{flexDirection: 'column', paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center'}} keyboardShouldPersistTaps={'always'}>
                    {this.props.children}
                </Content>
            </Container>
        </StyleProvider>;
    }
}

export default GunakContainer;