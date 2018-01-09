import React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from "../themes/flatUI";
import Typography from "../styles/Typography";
import PrimaryColors from "../styles/PrimaryColors";
import {Button, Container, Header, List, ListItem, Title} from "native-base";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ExportOptions extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        header: {
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
            backgroundColor: '#212121',
        },
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            justifyContent: 'center',
            marginTop: 30,
            marginHorizontal: 10
        },
        item: {
            color: PrimaryColors.subheader_black,
            height: 40,
            marginTop: 5
        }
    });

    render() {
        const Options = this.props.options.map((opt, idx) =>
            <ListItem key={idx} onPress={opt.cb}>
                <Text style={[Typography.paperFontSubhead, ExportOptions.styles.item]}>{opt.title}</Text>
            </ListItem>);
        return (
            <Container theme={FlatUITheme}>
                <Header style={ExportOptions.styles.header}>
                    <Title style={[Typography.paperFontTitle, {
                        fontWeight: 'bold',
                        color: 'white'
                    }]}>{this.props.title}</Title>
                </Header>
                <View style={ExportOptions.styles.container}>
                    <List>
                        {Options}
                    </List>
                    <Button style={{backgroundColor: PrimaryColors.blue, alignSelf: 'stretch', margin: 10}} block
                            onPress={this.props.onClose}>
                        Close
                    </Button>
                </View>
            </Container>
        );
    }
}

export default ExportOptions;