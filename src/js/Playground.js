import React, {Component} from "react";
import "./views";
import {NativeModules, View} from "react-native";
import models from "./models";
import Realm from "realm";
import EntitySyncStatus from "./models/sync/EntitySyncStatus";

const {Restart} = NativeModules;

export default class Playground extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        const db = new Realm(models);
        const allEntities = db.objects(EntitySyncStatus.schema.name);
        console.log({...allEntities.filtered('entityName = $0', "FacilityType")[0]});
    }

    render() {
        return <View/>;
    }
}
