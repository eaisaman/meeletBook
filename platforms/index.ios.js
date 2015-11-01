/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

require('./app/Util/date');

var React = require('react-native');
var {
    AppRegistry,
    NativeModules,
    Navigator,
    StyleSheet,
    Text,
    View,
    } = React;
var MainScreen = require('./app/Screens/MainScreen');

GLOBAL.LocalResourceAPI=NativeModules.LocalResourceManager;
GLOBAL.LocalAppAPI=NativeModules.LocalAppManager;
GLOBAL.LocalImage = require('./app/Components/LocalImage');

if (typeof window !== 'undefined') {
    window.React = React;
}

var MeeletBook = React.createClass({
    getInitialState() {
        return {}
    },
    renderScene(route, nav) {
        switch (route.id) {
            case 'main':
                return <MainScreen navigator={nav}/>;
            default:
                return <View />;
        }
    },
    render: function () {
        return (
            <Navigator
                initialRoute={{ id: 'main', }}
                renderScene={this.renderScene}
                configureScene={(route) => Navigator.SceneConfigs.FloatFromRight}/>
        );
    }
});

AppRegistry.registerComponent('MeeletBook', () => MeeletBook);
