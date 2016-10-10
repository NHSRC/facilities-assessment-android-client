import React, {Component} from 'react';
import {Text} from 'react-native';
import Path, {PathRoot} from '../framework/routing/Path';

@PathRoot
@Path("/main")
class HelloWorld extends Component {
    render() {
        return (<Text>HelloWorld</Text>);
    }
}

export default HelloWorld;