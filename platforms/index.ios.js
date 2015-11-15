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


GLOBAL.LOGIN_USER_STORAGE_KEY = "loginedUser";
GLOBAL.LocalResourceAPI=NativeModules.LocalResourceManager;
GLOBAL.LocalAppAPI=NativeModules.LocalAppManager;
GLOBAL.LocalImage = require('./app/Components/LocalImage');
GLOBAL.Icon = require('react-native-vector-icons/MaterialIcons');
GLOBAL.AppEvents = require('./app/Screens/AppEvents');
GLOBAL.AppService = require('./app/Screens/AppService');
var EventEmitter = require('EventEmitter');
GLOBAL.AppEventEmitter = new EventEmitter();
GLOBAL.AppContext = require('./app/Screens/AppContext');

var MainScreen = require('./app/Screens/MainScreen');
var LoadScreen = require('./app/Screens/LoadScreen');

if (typeof window !== 'undefined') {
    window.React = React;
}

var MeeletBook = React.createClass({
    getInitialState() {
        return {}
    },
    componentWillMount: function() {
        NativeAppEventEmitter.addListener(AppEvents.loginEvent, (userObj) => {
            //Join item include book or lesson created by user, and invitaiton sent to user
            AppService.getJoinItems(userObj._id);
        });

        NativeAppEventEmitter.addListener(AppEvents.logoutEvent, () => {
            AppContext.joinItems && AppContext.joinItems.splice(0);
        });

        NativeAppEventEmitter.once(AppEvents.downloadProjectModulesDoneEvent, () => {
            this.refs.navigator.replace({id:"main"});
        });

        NativeAppEventEmitter.once(AppEvents.downloadProjectModulesErrorEvent, ({error}) => {
        });

        //TODO
        LocalAppAPI.downloadModules(() => {});
        AppService.restoreUserFromStorage();
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
                // initialRoute={{ id: 'main', }}
                renderScene={this.renderScene}
                configureScene={(route) => Navigator.SceneConfigs.FloatFromRight}/>
        );
    },
});

AppRegistry.registerComponent('MeeletBook', () => MeeletBook);
