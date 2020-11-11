import React from "react";
import {Platform, ProgressBarAndroid, ProgressViewIOS} from "react-native";

export default class PlatformIndependentProgressBar {
    static display(progress, style = {}, color = "white") {
        if (Platform.OS === 'android')
            return <ProgressBarAndroid styleAttr="Horizontal" progress={progress} indeterminate={false} color="white" style={style}/>;
        else
            return <ProgressViewIOS progress={progress} progressViewStyle="bar" trackTintColor="white" style={style}/>;
    }
}