'use strict';

var React = require('react-native');
var {
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
              <View style={[styles.navBarRightButton, self.state.showSearchInput?{opacity:0}:{opacity:1}, ]}>
                <TouchableOpacity
                  onPress={self.toggleSearchInput}
                  style={styles.navButtonIconPlaceholder}>
                  <Icon name="search" size={24} style={[styles.navButtonIcon, ]}/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {navigator.pop();}}
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
              <View style={styles.titleContainer}>
                <View style={[styles.title, self.state.showSearchInput?{opacity:0}:{opacity:1}, ]}>
                  <View style={styles.titleIconPlaceholder}>
                    <Icon name="view-comfy" size={24} style={[styles.navButtonIcon, ]}/>
                  </View>
                  <Text style={styles.titleText}>{route.title}</Text>
                </View>
                <View style={[styles.searchContainer, self.state.showSearchInput?{opacity:1}:{opacity:0}, ]}>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="搜索"
                    autoCorrect={false}
                    returnKeyType="search"
                    onSubmitEditing={(event) => this.updateSearchInput(event.nativeEvent.text) }
                    style={styles.searchInput}
                  />
                </View>
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
            return <LessonListScreen navigator={nav} style={styles.scene}/>;
        default:
            return <View />;
    }
  },

  render: function() {
    return (
      <Navigator
        debugOverlay={false}
        style={styles.screen}
        initialRoute={{ id: 'list', title: '全部课程'}}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this._navBarRouteMapper}
            style={[styles.navBar, ]}
          />
        }
      />
    );
  },

  toggleSearchInput: function() {
    this.setState({showSearchInput: !this.state.showSearchInput});
  },

  updateSearchInput: function() {},
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
  titleContainer: {
    flex: 1,
    alignSelf: 'center',
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "#ccc"
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
  searchContainer: {
    flex: 1,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dde1dc',
    flexDirection: 'row',
  },
  searchInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 0.5,
    marginHorizontal: 10,
    marginVertical: 10,
    height: 40,
    flex: 1,
    fontSize: 24,
    textAlign: "center",
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