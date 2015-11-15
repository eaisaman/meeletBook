var React = require('react-native');
var {
  Image,
  StyleSheet,
  View,
} = React;

var imageSourceCache = {};
var LocalImage = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    if (this.props.source) {
      if (/^http/.test(this.props.source)) {
        this.setState({source:{uri:this.props.source}});
      } else {
        this.fetch(this.props.source).then(source => {this.setState({source});}, () => {this.setState({source:null})});
      }
    }
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
    return (
        <Image source={this.state.source || this.props.alt} defaultSource={this.props.alt} style={[styles.base, this.props.imgStyle, ]} />
    );
  }
});

var styles = StyleSheet.create({
  base: {
    width: 64,
    height: 64,
    resizeMode: Image.resizeMode.contain,
  },
});

module.exports = LocalImage;
