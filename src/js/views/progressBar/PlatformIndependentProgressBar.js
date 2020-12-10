import React from "react";
import {Platform, ProgressBarAndroid, ProgressViewIOS} from "react-native";
import KeepAwake from 'react-native-keep-awake';

export default class PlatformIndependentProgressBar {
    static display(progress, style = {}, color = "white") {
        if (Platform.OS === 'android')
            return <>
                <KeepAwake/>
                <ProgressBarAndroid styleAttr="Horizontal" progress={progress} indeterminate={false} color="white" style={style}/>
            </>;
        else
            return <><KeepAwake />
                <ProgressViewIOS progress={progress} progressViewStyle="bar" trackTintColor="white" style={style}/></>;
    }
}