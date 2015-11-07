/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

require('./app/Util/date');

var React = require('react-native');
var {
    AppRegistry,
    NativeAppEventEmitter,
    NativeModules,
    Navigator,
    StyleSheet,
    Text,
    View,
    } = React;
var MainScreen = require('./app/Screens/MainScreen');
var LoadScreen = require('./app/Screens/LoadScreen');

GLOBAL.LocalResourceAPI=NativeModules.LocalResourceManager;
GLOBAL.LocalAppAPI=NativeModules.LocalAppManager;
GLOBAL.LocalImage = require('./app/Components/LocalImage');
GLOBAL.Icon = require('react-native-vector-icons/MaterialIcons');
GLOBAL.AppEvents = require('./app/Screens/AppEvents');

if (typeof window !== 'undefined') {
    window.React = React;
}

var MeeletBook = React.createClass({
    getInitialState() {
        return {}
    },
    componentWillMount: function() {
        NativeAppEventEmitter.once(AppEvents.downloadProjectModulesDoneEvent, () => {
            this.refs.navigator.replace({id:"main"});
        });

        NativeAppEventEmitter.once(AppEvents.downloadProjectModulesErrorEvent, ({error}) => {
        });

        NativeAppEventEmitter.once(AppEvents.downloadProjectModulesProgressEvent, ({progress}) => {
        });

        LocalAppAPI.downloadModules(() => {});
    },
    renderScene(route, nav) {
        switch (route.id) {
            case 'load':
                return <LoadScreen navigator={nav} url="preload.html"/>;
            case 'main':
                return <MainScreen navigator={nav}/>;
            default:
                return <View />;
        }
    },
    render: function () {
        return (
            <Navigator ref="navigator"
                initialRoute={{ id: 'load', }}
                renderScene={this.renderScene}
                configureScene={(route) => Navigator.SceneConfigs.FloatFromRight}/>
        );
    },
});

AppRegistry.registerComponent('MeeletBook', () => MeeletBook);
