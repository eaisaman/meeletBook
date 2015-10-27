var React = require('react-native');
var {
  Image,
  NativeModules,
  StyleSheet,
  View,
} = React;

var LocalResourceAPI=NativeModules.LocalResourceManager

var imageSourceCache = {};
var LocalImage = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    this.fetch(this.props.source).then(source => {this.setState({source});});
  },

  componentWillReceiveProps: function(newProps) {
    this.state.source = this.props.alt;
  },

  fetch: function(source) {
    return new Promise((resolve, reject) => {
      var cached = imageSourceCache[source];
      if(typeof cached !== 'undefined') {
        if(!cached || cached instanceof Error ) { reject(cached); }
        return resolve({ uri: cached });
      }
      LocalResourceAPI.getResourcePath(source, function(err, image) {
        if(typeof err === 'string') {
          err = new Error(err);
        }
        imageSourceCache[source] = image || err || false;
        if(!err && image) {
          return resolve({ uri: image });
        }
        reject(err);
      });
    });
  },

  render: function() {
    return <Image source={this.state.source || this.props.alt} style={[styles.base]} />;
  }
});

var styles = StyleSheet.create({
  base: {
    resizeMode: Image.resizeMode.contain,
  },
});

module.exports = LocalImage;
