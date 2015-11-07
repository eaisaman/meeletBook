/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TimerMixin,
    View,
    WebView,
    } = React;

var LoadScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutId: (null: any),

  componentWillMount: function() {
    var self = this;

    LocalResourceAPI.getWebResourcePath(this.props.url, function(err, path) {
      if(!err && path) {
        self.setState({url:path});
      }
    });
  },

  getInitialState: function() {
    return {
      url: ""
    };
  },

  render() {
    return (
      <WebView
        automaticallyAdjustContentInsets={false}
        style={styles.webView}
        url={this.state.url}
        javaScriptEnabledAndroid={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    );
  },
});

var styles = StyleSheet.create({
  webView: {

  }
});

module.exports = LoadScreen;
