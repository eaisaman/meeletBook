'use strict';

var React = require('react-native');
var {
    AsyncStorage,
    StyleSheet,
    TabBarIOS,
    NavigatorIOS,
    Text,
    View,
    } = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var TalkMainScreen = require('./TalkMainScreen');
var FriendScreen = require('./FriendMainScreen');
var StudyMainScreen = require('./StudyMainScreen');
var ProfileMainScreen = require('./ProfileMainScreen');

var MainScreen = React.createClass({
    statics: {
        title: '<MainScreen>'
    },

    getInitialState: function () {
        return {
            selectedTab: 'studyTab',
            notifCount: 0
        };
    },

    _renderContent: function (color, pageText, num) {
        return (
            <View style={[styles.tabContent, {backgroundColor: color}]}>
                <Text style={styles.tabText}>{pageText}</Text>
                <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
            </View>
        );
    },
    _renderNavContent: function (title, component) {
      return (
        <NavigatorIOS
          style = {styles.container}
          initialRoute={{
            title: title,
            component: component
          }} />
      );
    },

    render: function () {
        return (
            <TabBarIOS
                tintColor="#27ae60"
                barTintColor="#ecf0f1">
                <Icon.TabBarItem
                    title="心声"
                    iconName="mood"
                    selected={this.state.selectedTab === 'talkTab'}
                    onPress={() => {
                        this.setState({selectedTab: 'talkTab',});
                    }}
                    >
                    <TalkMainScreen ref="talkSummary"></TalkMainScreen>
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="好友"
                    iconName="people"
                    selected={this.state.selectedTab === 'friendsTab'}
                    onPress={() => {
                        this.setState({selectedTab: 'friendsTab',});
                    }}
                    >
                    {this._renderNavContent('组群', FriendScreen)}
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="学习"
                    iconName="school"
                    selected={this.state.selectedTab === 'studyTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'studyTab'});
                    }}
                    >
                    <StudyMainScreen></StudyMainScreen>
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="个人"
                    iconName="face"
                    selected={this.state.selectedTab === 'profileTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'profileTab'});
                    }}
                    >
                    <ProfileMainScreen></ProfileMainScreen>
                </Icon.TabBarItem>
            </TabBarIOS>
        );
    }
});

var styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
    container: {
      flex: 1
    }
});

module.exports = MainScreen;
