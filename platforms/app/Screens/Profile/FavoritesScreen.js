'use strict';

var React = require('react-native');

var {
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} = React;

var FavoritesScreen = React.createClass({
  getInitialState: function() {
    return {

    };
  },
  render: function() {
    return (
      <View style={styles.screen}>
        <Text>FavoritesScreen</Text>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  screen: {
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    flex: 1,
    backgroundColor: '#dde1dc'
  },
});

module.exports = FavoritesScreen;