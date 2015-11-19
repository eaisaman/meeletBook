'use strict';

var React = require('react-native');
var {
  ActionSheetIOS,
  Navigator,
  StyleSheet,
  TabBarIOS,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  } = React;

var Icon = require('react-native-vector-icons/MaterialIcons');
var LessonListScreen = require('./LessonListScreen');

var StudyMainScreen = React.createClass({
  getInitialState: function() {
    return {
      showSearchInput: false,
    };
  },

  componentWillMount: function() {
    let self = this;

    this._navBarRouteMapper = {
      LeftButton: function(route, navigator, index, navState) {
        if (index === 0) {
          return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        var titleIconName;
        switch(previousRoute.id) {
          case "list":
            titleIconName = 'view-comfy';
            break;
        }

        return (
          <TouchableOpacity
            onPress={() => {navigator.pop();}}
            style={styles.navBarLeftButton}>
            <Icon name={titleIconName} size={24} style={[styles.navButtonIcon, ]}/>
          </TouchableOpacity>
        );
      },

      RightButton: function(route, navigator, index, navState) {
        switch(route.id) {
          case "list":
            return (
              <View style={[styles.navBarRightButton, ]}>
                <TouchableOpacity
                  onPress={self.showSearchInput}
                  style={styles.navButtonIconPlaceholder}>
                  <Icon name="search" size={24} style={[styles.navButtonIcon, ]}/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={self.showSearchCategory}
                  style={styles.navButtonIconPlaceholder}>
                  <Icon name="dehaze" size={24} style={[styles.navButtonIcon, ]}/>
                </TouchableOpacity>
              </View>
            );
            break;
        }

        return null;
      },

      Title: function(route, navigator, index, navState) {
        switch(route.id) {
          case "list":
            return (
              <View style={[styles.title, ]}>
                <View style={styles.titleIconPlaceholder}>
                  <Icon name="view-comfy" size={24} style={[styles.navButtonIcon, ]}/>
                </View>
                <Text style={styles.titleText}>{route.title}</Text>
              </View>
            );
            break;
        }

        return null;
      },
    };
  },

  renderScene(route, nav) {
    switch (route.id) {
        case 'list':
            return <LessonListScreen ref="listScreen" navigator={nav} mainScreen={this} showSearchInput={this.state.showSearchInput} style={styles.scene}/>;
        default:
            return <View />;
    }
  },

  render: function() {
    return (
      <Navigator
        ref="navigator"
        debugOverlay={false}
        style={styles.screen}
        initialRoute={{ id: 'list', title: '全部课程'}}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this._navBarRouteMapper}
            style={[styles.navBar, this.state.showSearchInput?{opacity: 0}:{opacity: 1}, ]}
          />
        }
      />
    );
  },

  showSearchInput: function() {
    this.refs.navigator.refs.listScreen.fadeInSearchInput();
    this.setState({showSearchInput: true});
  },

  hideSearchInput: function() {
    this.setState({showSearchInput: false});
  },

  showSearchCategory: function() {
    this.refs.navigator.refs.listScreen.showSideMenu();
  },
})

var styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navBarLeftButton: {
    paddingLeft: 10,
    width: 36,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  navBarRightButton: {
    paddingRight: 10,
    width: 100,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  navButtonIcon: {
    flex: 1,
    alignSelf: 'center',
    color: "white",
  },
  title: {
    width: 120,
    alignSelf: 'center',
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    textAlign: 'left',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  titleIconPlaceholder: {
    width: 24,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "transparent",
  },
  navButtonIconPlaceholder: {
    flex: 1,
    width: 24,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "transparent",
  },
});

module.exports = StudyMainScreen;