'use strict';

var React = require('react-native');

var {
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} = React;


var ProfileInfoDetailScreen = React.createClass({
  getInitialState: function() {
    return {showNavBar:false};
  },

  render: function() {
    return (
      <View style={styles.test}><Text>123</Text></View>
    );
  }
});

var styles = StyleSheet.create({
   test: {
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    backgroundColor: '#dde1dc',
  },
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
    opacity: 0,
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
    width: 36,
    height: Navigator.NavigationBar.Styles.General.NavBarHeight,
    justifyContent: 'center',
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
  }
});

module.exports = ProfileInfoDetailScreen;