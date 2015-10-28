'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  } = React;

var Icon = require('react-native-vector-icons/MaterialIcons');

var LessonListScreen = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <View style={styles.screen}>
      </View>
    );
  },
})

var styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

module.exports = LessonListScreen;